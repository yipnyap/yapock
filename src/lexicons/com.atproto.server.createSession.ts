export default function CreateSession(context: {
    body: any
}) {
    const {body} = context;
    return {
        accessJwt: 'test',
        refreshJwt: 'test',
        handle: 'test.yipnyap.me',
        did: 'did:at:test.yipnyap.me'
    }
}