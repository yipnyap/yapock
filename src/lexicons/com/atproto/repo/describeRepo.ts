import {DidResolver} from '@atproto/identity'
import {resolve} from '@/auth/did'

export default async function DescribeRepo(context: {
    query: {
        repo: string;
    }
}) {
    const {repo} = context.query;
    const didres = new DidResolver({})
    const did = await resolve(repo)

    const didDoc = await didres.resolve(did)
    const data = await didres.resolveAtprotoData(did)

    return {
        handle: data?.handle,
        did,
        didDoc,
        // @todo - get collections from repo
        collections: [],
        handleIsCorrect: true,
    }
}