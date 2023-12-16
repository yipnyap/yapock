import {LexValue} from '@atproto/lexicon'
import {AccountStoreInstance} from '@/storage'
import {WriteOpAction} from '@atproto/repo'
import { TID } from '@atproto/common-web';
import {resolve} from '@/auth/did'

export default async function CreateRecord(context: {
    body: {
        repo: string;
        collection: string;
        record: LexValue;
    }
}) {
    let {repo, collection, record} = context.body;
    await resolve(repo).then((res) => {
        repo = res;
    }).catch((err) => {
        throw new Error(err)
    })

    const repoStore = await AccountStoreInstance.getRepo();
    const rkey = TID.nextStr();
    const res = await repoStore.applyWrites(
        {
            action: WriteOpAction.Create,
            collection,
            rkey,
            record: {
                name: 'hello'
            },
        },
        AccountStoreInstance.getKeypair()
    )

    return {
        uri: `at://${repo}/${collection}/${rkey}`,
        cid: res.commit.data.toString(),
    }
}