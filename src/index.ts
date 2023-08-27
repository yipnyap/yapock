import {Elysia, ws} from 'elysia'
import {cors} from '@elysiajs/cors'
import Debug from 'debug'
import {WSOptions} from './websocket'
import {Aggregator} from './xrpc'

const log = {
    info: Debug('elysia:init'),
    request: Debug('elysia:request'),
}

const app = new Elysia()
    .onRequest(({set, request}) => {
        const url = new URL(request.url)
        log.request(`🔗 >> ${request.method} ${url.pathname}`)
        set.headers['Server'] = 'wominjeka/0.0.1'
    })
    .onResponse(({set, request}) => {
        const url = new URL(request.url)
        log.request(`🔗 << ${set.status} ${request.method} ${url.pathname}`)
    })
    .use(cors())
    .use(ws())
    .ws('/ws', WSOptions)
    .use(Aggregator)
    .listen(8080)

// GET /
app.get('/', () => {
    return {
        error: 'not_http',
        message: 'This is not an HTTP server. Please use XRPC.',
    }
})

log.info(`🦊 Running at ${app.server?.hostname}:${app.server?.port}`)
