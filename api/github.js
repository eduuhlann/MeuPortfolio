const GITHUB_USER = 'eduuhlann';

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800');

    const token = process.env.GITHUB_TOKEN || '';
    const headers = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'meu-portfolio'
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
        const params = new URLSearchParams({
            sort: 'updated',
            per_page: '6'
        });
        const res2 = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?${params}`, { headers });
        if (!res2.ok) {
            const limit = res2.headers.get('x-ratelimit-remaining');
            if (limit === '0') return res.status(200).json({ repos: [] });
            return res.status(200).json({ repos: [] });
        }
        const repos = await res2.json();

        const data = (Array.isArray(repos) ? repos : []).map(r => ({
            name: r.name ?? '',
            description: r.description ?? '',
            html_url: r.html_url ?? '',
            homepage: r.homepage || '',
            language: r.language || '',
            stars: r.stargazers_count ?? 0,
            forks: r.forks_count ?? 0,
            topics: r.topics ?? []
        })).filter(r => r.name);

        res.status(200).json({ repos: data });
    } catch (e) {
        res.status(200).json({ repos: [] });
    }
}
