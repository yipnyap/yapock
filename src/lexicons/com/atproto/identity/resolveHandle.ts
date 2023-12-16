import {resolve} from '@/auth/did'

export default async function ResolveHandle(context: {
    query: {
        handle: string;
    }
}) {
    const {handle} = context.query;
    return await resolve(handle)
}