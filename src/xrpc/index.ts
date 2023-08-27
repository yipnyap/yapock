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
import {GetXRPCFunction} from '../utils';

const debug = Debug('xrpc:aggregator')

export function Aggregator(app: Elysia) {
    return app.all('/xrpc/*', async (context) => {
        // don't remove "body", elysia is stupid and needs that to be called. {type:'json'} doesn't work on all() for some reason
        const {params, body} = context;
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
                const lexiconModule = await import(`../lexicons/${lexicon}`);

                if (param === 'describe') {
                    return lexiconModule.Describe();
                }

                return lexiconModule.default(context);
            } catch (e: any) {
                let detail = e.message;
                let code = 'InternalError';

                if (e.message.includes('Cannot find module')) {
                    code = 'NotFound';
                    context.set.status = 404;
                    detail = 'Lexicon not found.';
                }

                debug(`err: tried ${lexicon}: ${detail}`);
                console.log(e.stack);

                return {
                    error: code,
                    message: `tried ${lexicon}: ${detail}`,
                }
            }
        }
    });
}