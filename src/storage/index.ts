import {Repo} from '@atproto/repo'
import {Secp256k1Keypair} from '@atproto/crypto'
import MemoryBlockstore from '@/storage/memory'
import Debug from 'debug'

const debug = Debug('atproto:account:storage')

export class AccountStore {
    private static instance: AccountStore;
    private repo: {
        [key: string]: {
            repo: Repo;
            keypair: Secp256k1Keypair;
            storage: MemoryBlockstore;
        }
    } = {};

    constructor() {}

    public async getRepo(repo: string): Promise<Repo> {
        if (!this.repo[repo]) await this.initialiseRepo(repo)

        debug(`Getting repo for ${repo} - HEAD ${this.repo[repo].repo.commit.data.toString()} - Size ${await this.repo[repo].storage.sizeInBytes()}`)

        return Repo.load(this.repo[repo].storage)
    }

    public async getStorage(repo: string): Promise<MemoryBlockstore> {
        if (!this.repo[repo]) await this.initialiseRepo(repo)
        return this.repo[repo].storage;
    }

    public getKeypair(repo: string): Secp256k1Keypair {
        debug(`Getting keypair for repo ${repo}`)
        return <Secp256k1Keypair>this.repo[repo].keypair;
    }

    async initialiseRepo(repoName: string) {
        debug(`Creating repo ${repoName}`)

        const storage = new MemoryBlockstore()
        const keypair = await Secp256k1Keypair.create()
        const repo = await Repo.create(storage, repoName, keypair)
        debug(`Created repo ${repoName} - HEAD ${repo.commit.data.toString()}`)
        this.repo[repoName] = {
            repo,
            keypair,
            storage,
        }
    }

    async getRepoStatistic() {
        // Return how many repos are in memory, as well as the total size
        let size = 0;
        for (const repo in this.repo) {
            size += await this.repo[repo].storage.sizeInBytes()
        }

        return {
            count: Object.keys(this.repo).length,
            size,
        }
    }
}

export const AccountStoreInstance = new AccountStore();