import {Context} from 'elysia/dist'
import {VerifyXRPCInput} from '../utils'
import {addUser} from '../database/memory'

interface CreateAccountBody {
    email: string
    handle: string
    inviteCode?: string
    password: string
    recoveryKey?: string
}

export function Describe() {
    return {
        lexicon: 1,
        id: 'com.atproto.server.createAccount',
        defs: {
            main: {
                type: 'procedure',
                description: 'Create an account.',
                input: {
                    encoding: 'application/json',
                    schema: {
                        type: 'object',
                        required: [
                            'handle',
                            'email',
                            'password'
                        ],
                        properties: {
                            email: {
                                type: 'string'
                            },
                            handle: {
                                type: 'string',
                                format: 'handle'
                            },
                            inviteCode: {
                                type: 'string'
                            },
                            password: {
                                type: 'string'
                            },
                            recoveryKey: {
                                type: 'string'
                            }
                        }
                    }
                },
                output: {
                    encoding: 'application/json',
                    schema: {
                        type: 'object',
                        required: [
                            'accessJwt',
                            'refreshJwt',
                            'handle',
                            'did'
                        ],
                        properties: {
                            accessJwt: {
                                type: 'string'
                            },
                            refreshJwt: {
                                type: 'string'
                            },
                            handle: {
                                type: 'string',
                                format: 'handle'
                            },
                            did: {
                                type: 'string',
                                format: 'did'
                            }
                        }
                    }
                },
                errors: [
                    {
                        name: 'InvalidHandle'
                    },
                    {
                        name: 'InvalidPassword'
                    },
                    {
                        name: 'InvalidInviteCode'
                    },
                    {
                        name: 'HandleNotAvailable'
                    },
                    {
                        name: 'UnsupportedDomain'
                    },
                    {
                        name: 'RegistrationUnavailable'
                    }
                ]
            }
        }
    }
}

export default async function CreateAccount(context: {
    body: CreateAccountBody
    set: Context['set']
}) {
    const {body, set} = context;
    const lexiconVerified = await VerifyXRPCInput('com.atproto.server.createAccount', body);

    if (lexiconVerified.error) {
        set.status = 400;
        return lexiconVerified;
    }

    // Create in memory
    const {handle, password} = body;
    const did = `did:at:${handle}`;
    await addUser({
        handle,
        password,
        did
    })

    return {
        handle,
        did
    }
}
