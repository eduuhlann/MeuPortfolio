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

        res.status(200).json({
            playing,
            track: t.name ?? '',
            artists: [t.artist?.name || t.artist?.['#text'] || ''].filter(Boolean),
            album: t.album?.['#text'] ?? '',
            cover: t.image?.find(i => i.size === 'extralarge')?.['#text'] ?? '',
            url: t.url ?? '',
            progress: 0,
            duration: 0
        });
    } catch (e) {
        res.status(200).json({ track: null });
    }
}
