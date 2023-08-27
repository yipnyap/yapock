import {Context} from "elysia/dist";

export function Describe() {
    return {
        lexicon: 1,
        id: 'com.atproto.server.describeServer',
        defs: {
            main: {
                type: 'query',
                description: 'Get a document describing the service\'s accounts configuration.',
                output: {
                    encoding: 'application/json',
                    schema: {
                        type: 'object',
                        required: [
                            'availableUserDomains'
                        ],
                        properties: {
                            inviteCodeRequired: {
                                'type': 'boolean'
                            },
                            availableUserDomains: {
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            },
                            links: {
                                type: 'ref',
                                ref: '#links'
                            }
                        }
                    }
                }
            },
            links: {
                type: 'object',
                properties: {
                    privacyPolicy: {
                        type: 'string'
                    },
                    termsOfService: {
                        type: 'string'
                    }
                }
            }
        }
    }
}

export default function DescribeServer() {
    return {
        availableUserDomains: ['yipnyap.me'],
        links: {
            privacyPolicy: 'https://yipnyap.me/privacy',
            termsOfService: 'https://yipnyap.me/terms'
        }
    }
}