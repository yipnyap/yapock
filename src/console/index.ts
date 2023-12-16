import * as rl from 'readline';
import Debug from 'debug';

const log = Debug('console');

export default function Console() {
    const readline = rl.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // ">" always next to the cursor, even on log
    // Do. Not. Do. This. This hangs not just the CLI, but the entire process and, if unfortunate enough, your entire terminal.
    // readline.setPrompt('> ');
    // readline.prompt();

    // @TODO: maybe uh.... clean this up.
    readline.on('line', async (input) => {
        switch (input.trim()) {
            case 'help': {
                log('Commands: help, exit, quit, lexicons, lexicon describe [lexicon], lexicon verify <lexicon> [input|output|parameters] [json]');
                break;
            }

            case 'lexicons': {
                log('Lexicons:\n- ' + Object.keys(require('../lexicons').default).join('\n- '));
                return;
            }

            case 'lexicon describe': {
                log('Usage: lexicon describe [lexicon]');
                break;
            }

            case 'lexicon verify': {
                log('Usage: lexicon verify <lexicon> [input|output|parameters] [json]');
                break;
            }

            case 'exit':
            case 'quit': {
                process.exit(0);
                break;
            }

            default: {
                if (input.startsWith('lexicon describe')) {
                    const lexicon = input.split(' ')[2];
                    if (!lexicon) {
                        log('Usage: lexicon describe [lexicon]');
                    } else {
                        log(JSON.stringify(await import(`../lexicons/${lexicon.replace(/\./g, '/')}.json`).then((m) => m.default), null, 2));
                    }
                } else if (input.startsWith('lexicon verify')) {
                    const lexicon = input.split(' ')[2];
                    const type = input.split(' ')[3];
                    const json = input.split(' ').slice(4).join(' ');
                    if (!lexicon || !type || !json) {
                        log('Usage: lexicon verify [lexicon] [input|output|parameters] [json]');
                    } else {
                        log(require('../utils/VerifyInputOutput').default(lexicon, {
                            [type]: JSON.parse(json)
                        }));
                    }
                } else {
                    log('Unknown command. Type "help" for a list of commands.');
                }
            }
        }
    });

    log('You may now type commands. Type "help" for a list of commands.');
}
