/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// @ts-expect-error next line
import GoogleStrategy from 'passport-google-oidc';
import config from 'config';
import db from '../db';

export default new GoogleStrategy(
	{
		clientID: config.get('GOOGLE_CLIENT_ID'),
		clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
		callbackURL: '/auth/google/redirect',
		scope: ['profile']
	},
	function verify (issuer: any, profile: any, done: any) {
		db.get(
			'SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?',
			[issuer, profile.id],
			function (err, credentials) {
				if (err != null) {
					return done(err);
				}
				if (!credentials) {
					db.run(
						'INSERT INTO users (name) VALUES (?)',
						[profile.displayName],
						function (err) {
							if (err != null) {
								return done(err);
							}

							const id = this.lastID;
							db.run(
								'INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)',
								[id, issuer, profile.id],
								function (err) {
									if (err != null) {
										return done(err);
									}
									const user = {
										id,
										name: profile.displayName
									};
									return done(null, user);
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
								return done(err);
							}
							if (!user) {
								return done(null, false);
							}
							return done(null, user);
						}
					);
				}
			}
		);
	}
);

export const serializeGoogleUser = (user: any, done: any): any => {
	process.nextTick(() => {
		done(null, { id: user.id, username: user.username, name: user.name });
	});
};

export const deserializeGoogleUser = (user: any, done: any): any => {
	process.nextTick(() => {
		return done(null, user);
	});
};
