const rateMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

function isRateLimited(ip) {
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || now - entry.start > RATE_WINDOW) {
        rateMap.set(ip, { start: now, count: 1 });
        return false;
    }
    entry.count++;
    return entry.count > RATE_LIMIT;
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const { LASTFM_API_KEY, LASTFM_USER } = process.env;
    if (!LASTFM_API_KEY || !LASTFM_USER) {
        return res.status(200).json({ track: null });
    }

    try {
        const params = new URLSearchParams({
            method: 'user.getrecenttracks',
            user: LASTFM_USER,
            api_key: LASTFM_API_KEY,
            format: 'json',
            limit: '10',
            extended: '1'
        });

        const res2 = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`);
        if (!res2.ok) return res.status(200).json({ track: null });

        const data = await res2.json();
        const tracks = data?.recenttracks?.track;
        const list = Array.isArray(tracks) ? tracks.map(t => ({
            playing: t['@attr']?.nowplaying === 'true',
            track: t.name ?? '',
            artists: [(t.artist?.name || t.artist?.['#text'] || '')].filter(Boolean),
            album: t.album?.['#text'] ?? '',
            url: t.url ?? '',
            cover: t.image?.find(i => i.size === 'extralarge')?.['#text'] ?? '',
            preview: ''
        })).filter(t => t.track) : [];

        const t = list[0];
        if (!t) return res.status(200).json({ track: null });

        const playing = t.playing;
        if (!playing && process.env.LASTFM_ONLY_NOWPLAYING === 'true') {
            return res.status(200).json({ track: null });
        }

        // Placeholder do Last.fm (estrela): busca a capa real e preview no iTunes como fallback
        for (const item of list) {
            if (!item.cover || item.cover.includes('2a96cbd8b46e442fc41c2b86b821562f') || !item.preview) {
                try {
                    const query = encodeURIComponent([item.artists[0], item.track].filter(Boolean).join(' '));
                    const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=1`);
                    const itunesData = await itunesRes.json();
                    const result = itunesData?.results?.[0];
                    if (!result) continue;
                    const artwork = result.artworkUrl100;
                    if (artwork && (!item.cover || item.cover.includes('2a96cbd8b46e442fc41c2b86b821562f'))) {
                        item.cover = artwork.replace('100x100', '600x600');
                    }
                    if (!item.preview && result.previewUrl) item.preview = result.previewUrl;
                } catch (e) { /* mantem o placeholder mesmo */ }
            }
        }

        res.status(200).json({
            playing,
            track: t.track ?? '',
            artists: t.artists ?? [],
            album: t.album ?? '',
            cover: t.cover ?? '',
            url: t.url ?? '',
            preview: t.preview ?? '',
            progress: 0,
            duration: 0,
            history: list
        });
    } catch (e) {
        res.status(200).json({ track: null });
    }
}
