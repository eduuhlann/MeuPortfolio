export default async function handler(_req, res) {
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

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
            limit: '1',
            extended: '1'
        });

        const res2 = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`);
        if (!res2.ok) return res.status(200).json({ track: null });

        const data = await res2.json();
        const tracks = data?.recenttracks?.track;
        const t = Array.isArray(tracks) ? tracks[0] : tracks;
        if (!t) return res.status(200).json({ track: null });

        const playing = t['@attr']?.nowplaying === 'true';
        if (!playing && process.env.LASTFM_ONLY_NOWPLAYING === 'true') {
            return res.status(200).json({ track: null });
        }

        const artistName = t.artist?.name || t.artist?.['#text'] || '';
        let cover = t.image?.find(i => i.size === 'extralarge')?.['#text'] ?? '';

        // Placeholder do Last.fm (estrela): busca a capa real no iTunes como fallback
        if (!cover || cover.includes('2a96cbd8b46e442fc41c2b86b821562f')) {
            try {
                const query = encodeURIComponent([artistName, t.name].filter(Boolean).join(' '));
                const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=1`);
                const itunesData = await itunesRes.json();
                const artwork = itunesData?.results?.[0]?.artworkUrl100;
                if (artwork) cover = artwork.replace('100x100', '600x600');
            } catch (e) { /* mantem o placeholder mesmo */ }
        }

        res.status(200).json({
            playing,
            track: t.name ?? '',
            artists: [artistName].filter(Boolean),
            album: t.album?.['#text'] ?? '',
            cover,
            url: t.url ?? '',
            progress: 0,
            duration: 0
        });
    } catch (e) {
        res.status(200).json({ track: null });
    }
}
