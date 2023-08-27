/**
 * Verifies the POST input for the XRPC endpoint with the lexicon definition.
 * Example:
 * output: {
 *     encoding: 'application/json',
 *     schema: {
 *         type: 'object',
 *         required: [
 *             'accessJwt',
 *             'refreshJwt',
 *             'handle',
 *             'did'
 *         ],
 *         properties: {
 *             accessJwt: {
 *                 type: 'string'
 *             },
 *             refreshJwt: {
 *                 type: 'string'
 *             },
 *             handle: {
 *                 type: 'string',
 *                 format: 'handle'
 *             },
 *             did: {
 *                 type: 'string',
 *                 format: 'did'
 *             }
 *         }
 *     }
 * },
 *
 * input.accessJwt = 'string';
 * input.refreshJwt = 'string';
 * input.handle = 'string';
 * input.did = 'string';
 *
 * @param lexiconID - The lexicon to verify against, check the lexicon's `Describe()` function.
 * @param input - The input to verify.
 * @constructor
 */
export async function VerifyXRPCInput(lexiconID: string, input: { [x: string]: any; } | undefined) {
    if (!input) return {
        error: 'LexiconInputVerificationFailed',
        message: `Lexicon ${lexiconID} failed verification: No input was provided.`,
    };

    const lexiconModule: {
        Describe: () => {
            defs: {
                main: any;
            }
        };
    } = await import(`../lexicons/${lexiconID}`);
    const lexicon = lexiconModule.Describe();
    const requiredProperties = lexicon.defs.main.input.schema.required;
    let errors: string[] = [];

    // Go through each property in the input and verify it against the lexicon's definition.
    for (const [key, value] of Object.entries(input)) {
        if (lexicon.defs.main.input.schema.properties[key]) {
            const property = lexicon.defs.main.input.schema.properties[key];

            if (property.type === 'string' && property.format === 'handle') {
                if (typeof value !== 'string') errors.push(`Property "${key} as handle" is not a string.`);
                if (value.length < 3) errors.push(`Property "${key} as handle" is too short.`);
                if (value.length > 32) errors.push(`Property "${key} as handle" is too long.`);
            }

            if (property.type === 'string' && property.format === 'did') {
                if (typeof value !== 'string') errors.push(`Property "${key} as did" is not a string.`);
                if (value.length < 3) errors.push(`Property "${key} as did" is too short.`);
                if (value.length > 64) errors.push(`Property "${key} as did" is too long.`);
            }

            if (requiredProperties.includes(key)) {
                if (value === undefined || value === null) errors.push(`Property "${key}" is required.`);
            }
        } else {
            errors.push(`Property "${key}" does not exist in the lexicon definition.`);
        }
    }

    if (errors.length > 0) {
        return {
            error: 'LexiconInputVerificationFailed',
            message: `Lexicon ${lexiconID} failed verification: ${errors.join(', ')}`,
        }
    } else {
        return input;
    }
}