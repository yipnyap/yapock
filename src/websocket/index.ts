import {ServerWebSocket} from 'bun'

import Debug from 'debug'
import {Caller, Message} from './frame'
import {CloseCode, DisconnectError} from './types'
const debug = Debug('wominjeka:ws')

// forgive me
interface WSContext extends ServerWebSocket<{
    id: string
    handle: string
    authenticated: boolean
    pinginterval: any
}> {}

// todo: find the stupid types that this is supposed to follow
// noinspection JSUnusedGlobalSymbols
export const WSOptions: any = {
    async open(ws: WSContext) {
        ws.data.id = Math.random().toString(36).slice(2)
        debug(`🐺 ${ws.data.id} connected`)

        // JSON as binary
        const msg = new Message(ws, 1, 'com.ypnyp.socket.identify', {
            id: ws.data.id,
        })
        msg.write()

        setTimeout(() => {
            // if not yet authenticated, close
            if (!ws.data.authenticated) {
                const de = new DisconnectError(CloseCode.Policy, 'IdentityTimeout')
                const msg = new Message(ws, -1, null, {
                    error: de.xrpcCode,
                    message: de.message,
                })
                msg.write()
                ws.close(de.wsCode, de.xrpcCode)
            }
        }, 5000)
    },

    async close(ws: WSContext, code: number, reason: string) {
        debug(`🐺 ${ws.data.id} disconnected: ${code} ${reason}`)
        clearInterval(ws.data.pinginterval)
    },

    async message(ws: WSContext, msg: {
        t: string
        d: any
    }) {
        const caller = new Caller(ws)
        await caller.call(msg)
    },
}
