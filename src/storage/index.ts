import {Repo} from '@atproto/repo'
import {Secp256k1Keypair} from '@atproto/crypto'
import MemoryBlockstore from '@/storage/memory'

export class AccountStore {
    private static instance: AccountStore;
    private repo: Repo | undefined;
    private storage: MemoryBlockstore;
    private keypair: Secp256k1Keypair | undefined;

    constructor() {
        this.storage = new MemoryBlockstore()
        Secp256k1Keypair.create().then(keypair => {
            this.keypair = keypair;
            Repo.create(this.storage, keypair.did(), keypair).then(repo => {
                this.repo = repo;
            })
        })
    }

    public async getRepo(): Promise<Repo> {
        // this is fine, maybe. The head doesn't update when you add a record for ??? reason
        this.repo = await Repo.load(this.storage)
        return <Repo>this.repo;
    }

    public getStorage(): MemoryBlockstore {
        return this.storage;
    }

    public getKeypair(): Secp256k1Keypair {
        return <Secp256k1Keypair>this.keypair;
    }
}

export const AccountStoreInstance = new AccountStore();