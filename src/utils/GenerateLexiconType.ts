/**
 * Generates Typescript interface codes based off of the lexicon
 */
export async function GenerateLexiconType(lexiconID: string, type: string = 'ts') {
    let lexicon;
    try {
        lexicon = require(`../lexicons/${lexiconID.replace(/\./g, '/')}.json`);
    } catch (e) {
        console.log(e);
        return;
    }

    if (type === 'json') return lexicon;

    // Assume its already verified
    let output = '';

    // Print the description as a large comment block, if any.
    if (lexicon.defs.main.description) {
        output += `/**\n * ${lexicon.defs.main.description}\n */\n\n`;
    }

    // main.output
    if (lexicon.defs.main.output) {
        output += `export interface ${DotToCamelCase(lexiconID)} {\n`;
        output += GenerateTypes(lexicon.defs.main.output);
        output += `}\n\n`;
    }

    // main.input
    if (lexicon.defs.main.input) {
        output += `export interface ${DotToCamelCase(lexiconID)}${DotToCamelCase(lexicon.defs.main.type)} {\n`;
        output += GenerateTypes(lexicon.defs.main.input);
        output += `}\n\n`;
    }

    // Generate ref types
    // Search the lexicon.defs for any refs (keys that aren't 'main')
    for (const [key, value] of Object.entries(lexicon.defs)) {
        if (key !== 'main') {
            output += GenerateRefTypes(lexicon.defs, key);
        }
    }

    return output;
}

function GenerateRefTypes(lexicon: any, ref: string) {
    const refSchema = lexicon[ref];
    let output = `export interface ${DotToCamelCase(ref)} {\n`;
    for (const [key, value] of Object.entries<any>(refSchema.properties)) {
        output += `    ${key}: ${value.type};\n`;
    }
    output += `}\n`;
    return output;
}

function GenerateTypes(lexicon: any) {
    const requiredProperties = lexicon.schema.required;
    let output = '';
    for (const [key, value] of Object.entries<any>(lexicon.schema.properties)) {
        const required = requiredProperties.includes(key);
        // @ts-ignore
        let typeOutput = value.type;
        switch (typeOutput) {
            case 'ref':
                typeOutput = DotToCamelCase(value.ref.replace('#', ''));
                break;
            case 'array':
                typeOutput = `${value.items.type}[]`;
                break;
        }

        // Check for "description" and add it as a comment
        if (value.description) {
            output += `    // ${value.description}\n`;
        }

        output += `    ${key}${required ? '' : '?'}: ${typeOutput};\n`;
    }
    return output;
}

function DotToCamelCase(str: string) {
    // I.e. com.atproto.server.createAccount -> comAtprotoServerCreateAccount
    return str.replace(/\./g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return word.toUpperCase();
    }).replace(/\s+/g, '');
}