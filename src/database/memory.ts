import {Database} from 'bun:sqlite'

export const db = new Database(':memory:');

// Create a schema that holds user IDs and whether they're connected.
const UserTableCreation =
    db.query(`CREATE TABLE users
              (
                  did        TEXT PRIMARY KEY,
                  email      TEXT,
                  handle     TEXT,
                  password   TEXT
              )`);
// Passwords should be stored as hashes, but for now, we'll store them as plaintext to test
// @TODO: Don't, please god don't, store passwords as plaintext when this faces users.

UserTableCreation.run();

// Function to add a user to the database.
export async function addUser(obj: any) {
    const query = db.prepare(`INSERT INTO users (did, handle, password) VALUES ($DID, $HANDLE, $PASSWORD)`);

    query.run({
        $DID: obj.did,
        $HANDLE: obj.handle,
        $PASSWORD: obj.password,
    });

    // Close the query.
    query.finalize();

    return obj;
}

// Function to get a user from the database.
export async function getUser(did: string) {
    const query = db.prepare(`SELECT *
                              FROM users
                              WHERE did = $DID`);

    const user = await query.get({
        $DID: did,
    });

    // Close the query.
    query.finalize();

    return user;
}