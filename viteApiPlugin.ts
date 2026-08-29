import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

type ApiHandler = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>

function expressLikeRes(res: ServerResponse) {
    ;(res as any).status = (code: number) => {
        res.statusCode = code
        return {
            json: (body: unknown) => {
                res.setHeader('Content-Type', 'application/json; charset=utf-8')
                res.statusCode = code
                res.end(JSON.stringify(body))
            },
        }
    }
    return res
}

export function apiMiddlewarePlugin(): Plugin {
    return {
        name: 'portfolio-api-middleware',
        async configureServer(server) {
            const handlers: Array<{ path: RegExp; handler: ApiHandler }> = []
            const nowPlayingMod = await import('./api/now-playing.js')
            const githubMod = await import('./api/github.js')
            handlers.push({ path: /^\/api\/now-playing(?:\?|$)/, handler: nowPlayingMod.default })
            handlers.push({ path: /^\/api\/github(?:\?|$)/, handler: githubMod.default })

            server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
                const url = (req.url || '').split('?')[0]
                const match = handlers.find((h) => url.match(h.path))
                if (!match) return next()
                Promise.resolve(match.handler(req, expressLikeRes(res))).catch(() => {
                    res.statusCode = 500
                    res.statusMessage = 'Internal Server Error'
                    res.end()
                })
            })
        },
    }
}
