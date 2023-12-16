import Debug from 'debug'
import { lex } from '@/lexicons'

const debug = Debug('xrpc:verify')

async function GetLexiconFromCache(lexiconID: string) {
    let lexicon = await import(`../lexicons/${lexiconID.replace(/\./g, '/')}.json`);
    lexicon = lexicon.default;

    if (!lex.get(lexiconID)) lex.add(lexicon);
    return lexicon;
}
/**
 * Verifies the POST input for the XRPC endpoint with the lexicon definition.
 *
 * @param lexiconID - The lexicon to verify against, check the lexicon's `Describe()` function.
 * @param body
 * @constructor
 */
export async function VerifyXRPC(lexiconID: string, body: {
    parameters?: {
        [x: string]: any;
    }
    input?: {
        [x: string]: any;
    }
    output?: {
        [x: string]: any;
    }
}): Promise<any> {
    if (!body || (!body.parameters && !body.input && !body.output)) throw new Error('No usable body.', {
        cause: {
            code: 'LexiconVerificationFailed'
        }
    })

    try {
        const lexicon = await GetLexiconFromCache(lexiconID);
    } catch (e: any) {
        debug(`err: tried ${lexiconID}: ${e.message}`);
        throw new Error(e.message, {
            cause: {
                code: 'LexiconVerificationFailed'
            }
        })
    }

    try {
        if(!!body.parameters) lex.assertValidXrpcParams(lexiconID, body.parameters);
        if(!!body.input) lex.assertValidXrpcInput(lexiconID, body.input);
        if(!!body.output) lex.assertValidXrpcOutput(lexiconID, body.output);
    } catch (e: any) {
        debug(`err: tried ${lexiconID}: ${e.message}`);
        throw new Error(e.message, {
            cause: {
                code: 'LexiconVerificationFailed'
            }
        })
    }

    return body;
}