import {Database} from "bun:sqlite";

export const db = new Database(":memory:");

// Create a schema that holds user IDs and whether they're connected.
const UserTableCreation =
    db.query(`CREATE TABLE users
              (
                  id        TEXT PRIMARY KEY,
                  connected BOOLEAN
              )`);

UserTableCreation.run();

// Function to add a user to the database.
export async function addUser(id: string) {
    const query = db.prepare(`INSERT INTO users (id, connected)
                              VALUES ($ID, $CONNECTED)`);

    await query.run({
        $ID: id,
        $CONNECTED: true, // They're connected, so set this to true.
    });

    // Close the query.
    query.finalize();
}

// Function to get a user from the database.
export async function getUser(id: string) {
    const query = db.prepare(`SELECT *
                              FROM users
                              WHERE id = $ID`);

    const user = await query.get({
        $ID: id,
    });

    // Close the query.
    query.finalize();

    return user;
}