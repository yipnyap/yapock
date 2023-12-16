import {HandleResolver} from '@atproto/identity'

export const resolve = async (handle: string): Promise<string> => {
    if (handle.startsWith('did:')) {
        return handle
    } else {
        const hdlres = new HandleResolver()
        const res = await hdlres.resolve(handle)
        if (!res) throw new Error('HandleNotFound')
        return res
    }
}
