import {addUser} from '../../database/memory'
import Debug from 'debug'

const debug = Debug('me.yipnyap.socket.createSession')
export default function Identify(ws: any, d: { handle: any; password: any; }) {
    if (!d.handle) throw new Error('Missing handle')
    if (!d.password) throw new Error('Missing password')

    return addUser({
        handle: d.handle,
        password: d.password,
        did: `did:at:${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`
    }).then(r => {
        debug(`🐺 ${ws.data.id} is now ${r.handle} with did ${r.did}`)
        ws.data.authenticated = true
        return {
            op: 1,
            t: 'me.yipnyap.socket.sessionCreated',
            d: {
                id: r.did,
                handle: r.handle,
            }
        }
    })
}