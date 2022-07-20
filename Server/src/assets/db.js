import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import os from 'os';

// get json file
const adapter = new FileSync(`${os.homedir()}/Desktop/db2.json`);
// wrap in lowdb instance
const db = lowdb(adapter);

export default db;
