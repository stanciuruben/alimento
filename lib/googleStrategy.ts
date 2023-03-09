/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// @ts-expect-error next line
import GoogleStrategy from 'passport-google-oidc';
import config from 'config';
import db from '../db';
import type { DoneLocalCallback } from '../types/DoneLocalCallback';

const START_BUDGET: number = 25;
const fields = {
	clientID: config.get('GOOGLE_CLIENT_ID'),
	clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
	callbackURL: 'https://www.rubenstanciu.com/alimento/auth/google/redirect',
	scope: ['profile']
};
const verify = (issuer: any, profile: any, done: DoneLocalCallback): void => {
	db.get(
		'SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?',
		[issuer, profile.id],
		function (err, credentials) {
			if (err != null) {
				done(err, false, { message: 'Something went wong.' });
				return;
			}
			if (!credentials) {
				db.run(
					'INSERT INTO users (username, tokens) VALUES (?, ?)',
					[profile.displayName, START_BUDGET],
					function (err) {
						if (err != null) {
							done(err, false, { message: 'Something went wong.' });
							return;
						}

						const id = this.lastID;
						db.run(
							'INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)',
							[id, issuer, profile.id],
							function (err) {
								if (err != null) {
									done(err, false, { message: 'Something went wong.' });
									return;
								}
								const user = {
									id,
									username: profile.displayName,
									tokens: START_BUDGET
								};
								done(null, user);
							}
						);
					}
				);
			} else {
				db.get(
					'SELECT * FROM users WHERE id = ?',
					[credentials.user_id],
					function (err, user) {
						if (err != null) {
							done(err, false, { message: 'Something went wong.' });
							return;
						}
						if (!user) {
							done(err, false, { message: 'Something went wong.' });
							return;
						}
						done(null, user);
					}
				);
			}
		}
	);
};

export default new GoogleStrategy(fields, verify);
