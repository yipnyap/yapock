const startupTime = Date.now()
import boxen from 'boxen'
import {Elysia, ws} from 'elysia'
import {cors} from '@elysiajs/cors'
import Debug from 'debug'
import {WSOptions} from './realtime'
import {Aggregator} from './xrpc'
import lexicons from '@/lexicons'
import {AccountStoreInstance} from '@/storage'

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
        .get('/', async () => {
            return {
                queueTimeMs: Math.round((Object.values(AnalyticaTimeCache).reduce((a, b) => a + b, 0) / Object.values(AnalyticaTimeCache).length) * 100) / 100,
                queue: Object.keys(AnalyticalTimeWaitCache).length - 1,
                reqSinceStartup: Object.keys(AnalyticaTimeCache).length,
                uptime: Date.now() - startupTime,
                repoMemory: await AccountStoreInstance.getRepoStatistic(),
            }
        })
        .listen(8080)

    log.info(`Server \x1b[32mOK\x1b[0m: Startup took ${Date.now() - startupTime}ms`)
    fetch(`${app.server?.hostname}:${app.server?.port}/xrpc/com.atproto.server.describeServer`).then(res => res.json()).then(res => {
        // @ts-ignore
        if (!res || !res.availableUserDomains || !res.availableUserDomains.length) {
            log.error('Aggregator \x1b[31mFAIL\x1b[0m: The server didn\'t describe properly!')
            console.log(boxen(`\x1b[31mThe server didn't describe properly!\x1b[0m\n${JSON.stringify(res, null, 2)}`, {title: 'Aggregator \x1b[31mFAIL\x1b[0m', borderStyle: 'bold', fullscreen: (width, height) => [width, height - 1]}))
            process.exit(1)
        } else {
            log.info('Aggregator \x1b[32mOK\x1b[0m')
        }
    })
}

// wait until lexicons.walked returns true
log.info('Lexicon ....')
const wait = setInterval(() => {
    if (lexicons.walked) {
        const total = Object.keys(lexicons.list).length;
        const unimplemented = total - Object.keys(lexicons.implemented).length;
        if (unimplemented == total) {
            log.error(boxen('This server does nothing.', {title: 'Aggregator \x1b[31mFAIL\x1b[0m', padding: 1, borderStyle: 'double'}))
            process.exit(1)
        } else if (unimplemented > 0) {
            log.info(`Lexicon \x1b[33mPASS\x1b[0m: ${unimplemented} procedures have no function.`)
        }
        clearInterval(wait)
        main()
    }
}, 100)
