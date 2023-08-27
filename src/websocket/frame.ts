import {CloseCode} from './types'

export class Message {
    op: any;
    t: any;
    d: any;

    constructor(private ws: any, op: any, t: any, d: any) {
        // if (!d) throw new Error('All frames must have a body');

        this.op = op;
        if (op === -1) {
            if (t) throw new Error('Error frame cannot have a type discriminator');
            this.d = d;
        } else {
            if (!t) throw new Error('Message frame must have a type discriminator');
            this.t = t;
            this.d = d;
        }
    }

    toJSON() {
        return {
            op: this.op,
            t: this.t,
            d: this.d,
        }
    }

    toString() {
        return JSON.stringify(this.toJSON())
    }

    write() {
        this.ws.send(this.toString())
    }
}

/**
 * Handles calling XRPC functions
 */
export class Caller {
    constructor(private ws: any) {}

    async call(_msg: { t: string; d: any; }) {
        try {
            const lexiconModule = await import(`../lexicons/socket/${_msg.t}`);
            const lexiconRun = await lexiconModule.default(this.ws, _msg.d);
            if (!lexiconRun || typeof lexiconRun !== 'object') return;

            const {op, t, d} = lexiconRun;
            const msg = new Message(this.ws, op, t, d);
            msg.write();
        } catch (e: any) {
            let error = 'InternalError';
            console.log(e.stack);

            if (e.message.includes('Cannot find module')) {
                error = 'NotFound';
                const msg = new Message(this.ws, -1, null, {
                    error,
                    message: 'Lexicon not found.',
                });
                msg.write();

                return this.ws.close(CloseCode.Policy, error);
            }

            const msg = new Message(this.ws, -1, null, {
                error,
                message: `tried ${_msg.t}: ${e.message}`,
            });
            msg.write();

            return this.ws.close(CloseCode.Abnormal, error);
        }
    }
}
