/**
 * ATP XRPC Server
 *
 * This uses a regular HTTP server, except all requests are through `/xrpc/<lexicon>`.
 * Lexicons are validated via their specific JSON schema within ../lexicons.
 *
 * 🙌 AT Protocol is a breath of fresh f'ing air, I swear. #THX to the ATP matrix group!
 */
import {Elysia} from 'elysia'
import Debug from 'debug';
import {GetXRPCFunction, VerifyXRPC} from '../utils';
import {GenerateLexiconType} from '../utils/GenerateLexiconType'

const debug = Debug('xrpc:aggregator')

export function Aggregator(app: Elysia) {
    return app.all('/xrpc/*', async (context) => {
        // don't remove "body", elysia is stupid and needs that to be called. {type:'json'} doesn't work on all() for some reason
        const {params, query, body}: {
            params: {
                '*': string
            }
            query: {
                [x: string]: any
            }
            body: any
        } = context;
        // url has entire host, btw
        const {lexicon, param} = GetXRPCFunction(params['*']);

        if (!lexicon) {
            return {
                error: 'no_lexicon',
                message: 'No lexicon specified, index is not allowed.',
            }
        } else {
            // Check if lexicon exists
            try {
                if (param === 'describe') return GenerateLexiconType(lexicon, query.type || 'json');

                const lexiconModule = await import(`../lexicons/${lexicon.replace(/\./g, '/')}.ts`);
                const lexiconSchema = await import(`../lexicons/${lexicon.replace(/\./g, '/')}.json`).then((m) => m.default);

                if (lexiconSchema.defs.main.parameters) await VerifyXRPC(lexicon, {
                    parameters: query || {}
                });

                if (lexiconSchema.defs.main.input) await VerifyXRPC(lexicon, {
                    input: body
                });

                const result = await lexiconModule.default(context);
                if (result.error) {
                    if (result._statcode) {
                        context.set.status = result._statcode;
                        delete result._statcode;
                    }
                    return result;
                }

                return VerifyXRPC(lexicon, {
                    output: result
                }).then((r) => r.output);
            } catch (e: any) {
                let detail = e.message;
                let code = 'InternalError';

                if (e.message.includes('Cannot find module')) {
                    code = 'NotFound';
                    context.set.status = 404;
                    detail = 'Lexicon not found.';
                }

                if (e.cause?.code) code = e.cause.code;

                debug(`err: tried ${lexicon}: ${code}: ${detail}\n${e.message}`);

                return {
                    error: code,
                    message: `tried ${lexicon}: ${detail}`,
                }
            }
        }
    });
}