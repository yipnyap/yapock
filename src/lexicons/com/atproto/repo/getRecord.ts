import {CID} from 'multiformats'
import {AccountStoreInstance} from '@/storage'
import {resolve} from '@/auth/did'

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

    const storage = AccountStoreInstance.getStorage();
    const repoStore = await AccountStoreInstance.getRepo();

    const commit = query.commit
        ? CID.parse(query.commit)
        : await storage.getHead()
    if (!commit) {
        throw new Error('Repository not initialized')
    }

    const record = await repoStore.getRecord(collection, rkey)
    if (!record) {
        return {
            _statcode: 404,
            error: 'RecordNotFound'
        }
    }

    return {
        uri: `at://${repo}/${collection}/${rkey}`,
        cid: commit.toString(),
        value: record,
    }
}