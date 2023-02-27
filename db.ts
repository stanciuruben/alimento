/* eslint-disable no-multi-str */
import sqlite3 from 'sqlite3';
import mkdirp from 'mkdirp';

mkdirp.sync('./var/db');

const db = new sqlite3.Database('./var/db/alimento.db');

db.serialize(function () {
	db.run(
		'CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB, \
    email TEXT UNIQUE, \
    tokens INTEGER \
  )'
	);

	db.run(
		'CREATE TABLE IF NOT EXISTS federated_credentials ( \
    id INTEGER PRIMARY KEY, \
    user_id INTEGER NOT NULL, \
    provider TEXT NOT NULL, \
    subject TEXT NOT NULL, \
    UNIQUE (provider, subject) \
  )'
	);

	db.run(
		'CREATE TABLE IF NOT EXISTS mealplans ( \
    id INTEGER PRIMARY KEY, \
    owner_id INTEGER NOT NULL, \
    text TEXT NOT NULL \
  )'
	);
});

export default db;
export async function dbGet (query: string, parameters: any[]): Promise<any> {
	return await new Promise(function (resolve, reject) {
		db.get(query, parameters, function (err, rows) {
			if (err != null) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
}
