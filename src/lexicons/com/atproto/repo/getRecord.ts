import {AccountStoreInstance} from '@/storage'
import {resolve} from '@/auth/did'
import { def } from '@atproto/common-web'

export default async function GetRecord(context: {
    query: {
        repo: string;
        collection: string;
        rkey: string;
        commit?: string;
    }
}) {
    const {query} = context;
    let {repo, collection, rkey} = query;
    repo = await resolve(repo)

    const storage = await AccountStoreInstance.getStorage(repo);
    const repoStore = await AccountStoreInstance.getRepo(repo);

    const cid = await repoStore.data.get(`${collection}/${rkey}`)
    if (!cid) return {
        _statcode: 404,
        error: 'RecordNotFound',
    }

    const record = await storage.readObj(cid, def.unknown)

    return {
        uri: `at://${repo}/${collection}/${rkey}`,
        cid: cid.toString(),
        value: record,
    }
}