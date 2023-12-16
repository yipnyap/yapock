import Console from '@/console'

const startupTime = Date.now()
import {Elysia, ws} from 'elysia'
import {cors} from '@elysiajs/cors'
import Debug from 'debug'
import {WSOptions} from './websocket'
import {Aggregator} from './xrpc'
import './lexicons'

const log = {
    info: Debug('init'),
    request: Debug('request'),
    error: Debug('init:error'),
}

// @TODO: This may cause a memory leak with request spam? Maybe limit to a few for average instead of all.
const AnalyticaTimeCache: {
    [key: string]: number
} = {}

const AnalyticalTimeWaitCache: {
    [key: string]: number
} = {}

let states: {
    PLCAttempted?: boolean
    ServerOnline?: boolean
} = {}

const main = () => {
    const app = new Elysia()
        .onRequest(({set, request}) => {
            const RequestID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            set.headers['X-Request-Id'] = RequestID
            AnalyticalTimeWaitCache[RequestID] = Date.now()

            const url = new URL(request.url)
            log.request(`🔗 >> ${request.method} ${url.pathname}`)
            set.headers['Server'] = 'wominjeka/0.0.1'
        })
        .onResponse(({set, request}) => {
            AnalyticaTimeCache[set.headers['X-Request-Id']] = Date.now() - AnalyticalTimeWaitCache[set.headers['X-Request-Id']]
            delete AnalyticalTimeWaitCache[set.headers['X-Request-Id']]

            const url = new URL(request.url)
            log.request(`🔗 << ${set.status} ${request.method} ${url.pathname} - Took ${AnalyticaTimeCache[set.headers['X-Request-Id']]}ms`)
        })
        .use(cors())
        .use(ws())
        .ws('/ws', WSOptions)
        .use(Aggregator)
        .get('/', ({set}) => {
            return {
                queueTimeMs: Math.round((Object.values(AnalyticaTimeCache).reduce((a, b) => a + b, 0) / Object.values(AnalyticaTimeCache).length) * 100) / 100,
                queue: Object.keys(AnalyticalTimeWaitCache).length - 1,
                reqSinceStartup: Object.keys(AnalyticaTimeCache).length,
                uptime: Date.now() - startupTime,
                states,
            }
        })
        .listen(8080)

    log.info(`🦊✅ Project W PDS listening at ${app.server?.hostname}:${app.server?.port}. Startup took ${Date.now() - startupTime}ms`)
}

const healthCheck = () => {
    log.info('🦊 W is performing a health check.')
    main()
}

healthCheck()
