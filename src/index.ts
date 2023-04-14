import {Elysia, ws} from 'elysia'
import Debug from 'debug';
import {WSOptions} from './websocket'

const debug = Debug('elysia:init');

const app = new Elysia()
    .use(ws())
    .ws('/v3/ws', WSOptions)
    .listen(8080)

debug(`🦊 Running at ${app.server?.hostname}:${app.server?.port}`)
