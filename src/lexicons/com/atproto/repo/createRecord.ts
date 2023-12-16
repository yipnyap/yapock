import {LexValue, RepoRecord} from '@atproto/lexicon'
import {AccountStoreInstance} from '@/storage'
import {WriteOpAction} from '@atproto/repo'
import { TID } from '@atproto/common-web';
import {resolve} from '@/auth/did'

export default async function CreateRecord(context: {
    body: {
        repo: string;
        collection: string;
        record: RepoRecord;
    }
}) {
    let {repo, collection, record} = context.body;
    repo = await resolve(repo)

    const repoStore = await AccountStoreInstance.getRepo(repo)
    const rkey = TID.nextStr();
    const res = await repoStore.applyWrites(
        {
            action: WriteOpAction.Create,
            collection,
            rkey,
            record
        },
        AccountStoreInstance.getKeypair(repo)
    )

    const cid = await res.data.get(`${collection}/${rkey}`)

    return {
        uri: `at://${repo}/${collection}/${rkey}`,
        cid: cid?.toString(),
    }
}