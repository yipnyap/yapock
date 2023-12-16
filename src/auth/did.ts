import dns from 'dns'

export const resolve = async (handle: string): Promise<string> => {
    if (handle.startsWith('did:plc')) {
        return resolvePLC(handle)
    } else {
        return await resolveWeb(handle)
    }
}

export const resolvePLC = async (handle: string) => {
    return '';
}

export const resolveWeb = async (handle: string): Promise<string> => {
    return await dns.promises.resolveTxt(`_atproto.${handle}`).then((records): string => {
        // Find did= in TXT record
        const did = records.find((record) => record.find((txt) => txt.startsWith('did=')))
        const didFind = did?.find((txt) => txt.startsWith('did='))?.replace('did=', '');
        if (!did || !didFind) {
            throw new Error('No DID linked to this domain.')
        } else {
            return didFind;
        }
    }).catch(() => {
        // Try to find a DID in /.well-known/atproto-did
        return fetch(`https://${handle}/.well-known/atproto-did`).then(async (res) => {
            if (res.status === 200) {
                return await res.text()
            } else {
                throw new Error('No DID linked to this domain.')
            }
        }).catch((err) => {
            throw new Error('No DID linked to this domain.')
        })
    })
}