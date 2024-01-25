# Archived

As much as the [atprotocol](https://atproto.com) is nice, it's too convoluted to switch over just yet, especially for developers not yet used to ATP.

# Wominjeka

[![Wolfbite Labs proof-of-concept project image](/.github/poc-landing.png)](https://labs.yipnyap.me/)

Commonly "Welcome" in Woiwurrung. What once was the Chat API for Yipnyap, is now the [AT Protocol](https://atproto.com/) PDS implementation.

**THIS IS NOT PRODUCTION READY.** If you do run this, run it either air-gapped or in a sandbox network. Almost nothing is finished.

## Implementation
(Categories missing have no implementations)

### Identity

- [x] [com.atproto.identity.resolveHandle](./src/lexicons/com/atproto/identity/resolveHandle.ts)
- [ ] [com.atproto.identity.updateHandle](./src/lexicons/com/atproto/identity/updateHandle.json)

### Server

- [x] [com.atproto.server.describeServer](./src/lexicons/com/atproto/server/describeServer.ts)
- [ ] [com.atproto.server.createAccount](./src/lexicons/com/atproto/server/createAccount.json)
- [ ] [com.atproto.server.createAppPassword](./src/lexicons/com/atproto/server/createAppPassword.json)
- [ ] [com.atproto.server.createInviteCode](./src/lexicons/com/atproto/server/createInviteCode.json)
- [ ] [com.atproto.server.createInviteCodes](./src/lexicons/com/atproto/server/createInviteCodes.json)
- [ ] [com.atproto.server.createSession](./src/lexicons/com/atproto/server/createSession.json)
- [ ] [com.atproto.server.deleteAccount](./src/lexicons/com/atproto/server/deleteAccount.json)
- [ ] [com.atproto.server.deleteSession](./src/lexicons/com/atproto/server/deleteSession.json)
- [ ] [com.atproto.server.getAccountInviteCodes](./src/lexicons/com/atproto/server/getAccountInviteCodes.json)
- [ ] [com.atproto.server.getSession](./src/lexicons/com/atproto/server/getSession.json)
- [ ] [com.atproto.server.listAppPasswords](./src/lexicons/com/atproto/server/listAppPasswords.json)
- [ ] [com.atproto.server.refreshSession](./src/lexicons/com/atproto/server/refreshSession.json)
- [ ] [com.atproto.server.requestAccountDelete](./src/lexicons/com/atproto/server/requestAccountDelete.json)
- [ ] [com.atproto.server.resetPassword](./src/lexicons/com/atproto/server/resetPassword.json)
- [ ] [com.atproto.server.revokeAppPassword](./src/lexicons/com/atproto/server/revokeAppPassword.json)

### Data Repository

- [x] [com.atproto.repo.createRecord](./src/lexicons/com/atproto/repo/createRecord.ts)
- [x] [com.atproto.repo.describeRepo](./src/lexicons/com/atproto/repo/describeRepo.ts)
- [x] [com.atproto.repo.getRecord](./src/lexicons/com/atproto/repo/getRecord.ts)
- [ ] [com.atproto.repo.applyWrites](./src/lexicons/com/atproto/repo/applyWrites.json)
- [ ] [com.atproto.repo.deleteRecord](./src/lexicons/com/atproto/repo/deleteRecord.json)
- [ ] [com.atproto.repo.listRecords](./src/lexicons/com/atproto/repo/listRecords.json)
- [ ] [com.atproto.repo.putRecord](./src/lexicons/com/atproto/repo/putRecord.json)
- [ ] [com.atproto.repo.rebaseRepo](./src/lexicons/com/atproto/repo/rebaseRepo.json)
- [ ] [com.atproto.repo.uploadBlob](./src/lexicons/com/atproto/repo/uploadBlob.json)

## Installation

You need [Bun](https://bun.sh/). On Windows, use WSL2.

Storage is up to you, and can be implemented with a plugin. The default is `MemoryBlockstore` which is lost on process exit. Supabase and Prisma are the only "officially" supported plugins by Wolfbite Labs.

```bash
# S1: Choose a storage provider, or none for memory.
# - supabase: https://supabase.io/
# - prisma: https://www.prisma.io/
# Switch with `bun storage <name>`:
bun storage prisma
# or bun storage @someone/some-plugin

# S2: Install dependencies
bun install

# S3: Run the server - There is no build step or "production mode" as of yet.
bun start
```
