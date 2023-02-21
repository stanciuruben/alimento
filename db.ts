/* eslint-disable no-multi-str */
import sqlite3 from 'sqlite3';
import mkdirp from 'mkdirp';

mkdirp.sync('./var/db');

const db = new sqlite3.Database('./var/db/alimento.db');

db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB, \
    name TEXT, \
    email TEXT UNIQUE \
  )');

  db.run('CREATE TABLE IF NOT EXISTS federated_credentials ( \
    id INTEGER PRIMARY KEY, \
    user_id INTEGER NOT NULL, \
    provider TEXT NOT NULL, \
    subject TEXT NOT NULL, \
    UNIQUE (provider, subject) \
  )');

  db.run('CREATE TABLE IF NOT EXISTS mealplans ( \
    id INTEGER PRIMARY KEY, \
    owner_id INTEGER NOT NULL, \
    text TEXT NOT NULL \
  )');

    // create an initial user (username: alice, password: letmein)
//   const salt = crypto.randomBytes(16);
//   db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
//     'alice',
//     crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
//     salt
//   ]);
});

export default db;
