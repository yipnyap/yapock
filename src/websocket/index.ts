import {ServerWebSocket} from 'bun'
import {addUser, getUser} from '../database/memory'
import {WSOPCode} from '../utils'

import Debug from 'debug'
import {t} from "elysia";

const debug = Debug('wominjeka:ws')

interface WSBody {
    op: number
    d?: any
}

// forgive me
interface WSContext extends ServerWebSocket<{
    // Bun specific
    id: string
    store?: {}
    request?: {}
    set?: {
        headers: {}
        status: number
    }
    query?: {}
    params?: {}
    transformMessage: []
} extends WSBody ? WSBody : any> {
    authenticated: boolean
}

// todo: find the stupid types that this is supposed to follow
// noinspection JSUnusedGlobalSymbols
export const WSOptions: any = {
    schema: {
        op: t.Number(),
        d: t.Optional(t.Any()),
    },

    open(ws: WSContext) {
        debug(`🐺 New connection from ${ws.data.id}`)
        // Send HELLO
        ws.send(JSON.stringify({
            op: WSOPCode.HELLO,
            d: {
                i: ws.data.id,
                h: 5000,
            },
        }))

        // After 5 seconds, if they're not authenticated, close the connection
        setTimeout(async () => {
            // Check the db for ws.data.id and check connected flag
            const userEntity: any = await getUser(ws.data.id)
            if (!userEntity?.connected) {
                debug(`🐺 ${ws.data.id} not authenticated, closing`)
                ws.close(4000, 'Not authenticated')
            }
        }, 5000)
    },

    async message(ws: WSContext, message: WSBody) {
        debug(`🐺 ${ws.data.id} sent ${message.op}`)

        switch (message.op) {
            case WSOPCode.HELLO:
                // Send GOODBYE joke
                ws.send(JSON.stringify({
                    op: -999,
                    d: 'VERY_FUNNY',
                }))
                break

            case WSOPCode.IDENTIFY:
                const userEntity: any = await getUser(ws.data.id)
                if (userEntity?.connected) {
                    ws.close(4000, 'Already authenticated')
                    return
                }

                // Authenticate the user by checking the provided token
                // If the token is invalid, close the connection
                // If the token is valid, set the authenticated flag to true
                // and send a READY packet
                if (message.d === 'secret') {
                    debug(`🐺 ${ws.data.id} authenticated`)
                    await addUser(ws.data.id)
                    ws.send(JSON.stringify({
                        op: WSOPCode.READY,
                        d: {
                            id: ws.data.id,
                            user: {
                                id: '1234567890',
                                username: 'wominjeka',
                                discriminator: '0001',
                                avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
                                bot: false,
                            },
                        },
                    }))
                } else {
                    ws.close(4000, 'Invalid token')
                }
                break
        }
    },
}
