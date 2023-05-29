/* eslint-disable no-multi-str */
import sqlite3 from 'sqlite3';
import mkdirp from 'mkdirp';
import path = require('path');

mkdirp.sync('./var/db');

const db = new sqlite3.Database(path.join(__dirname, '../var/db/alimento.db'));

db.serialize(() => {
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
			user_id INTEGER NOT NULL, \
			name TEXT NOT NULL, \
			text TEXT NOT NULL, \
			diet TEXT, \
			protein INTEGER, \
			carbs INTEGER, \
			fat INTEGER, \
			allergens TEXT, \
			date TEXT \
		)'
	);
});

export default db;
export const dbGet = async (query: string, parameters: any[]): Promise<any> => {
	return await new Promise((resolve, reject) => {
		db.get(query, parameters, (err, rows) => {
			if (err != null) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
};

export const dbAll = async (
	query: string,
	parameters: any[]
): Promise<any[]> => {
	return await new Promise((resolve, reject) => {
		db.all(query, parameters, (err, rows) => {
			if (err != null) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	});
};

export const dbRun = async (query: string, parameters: any[]): Promise<any> => {
	return await new Promise((resolve, reject) => {
		db.run(query, parameters, (err) => {
			if (err != null) {
				reject(err);
				return;
			}
			resolve(true);
		});
	});
};
