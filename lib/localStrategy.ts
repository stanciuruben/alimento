/* eslint-disable @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-var-requires */
import db from '../db';
import bcrypt from 'bcrypt';
import type { DoneLocalCallback } from '../types/DoneLocalCallback';
const LocalStrategy = require('passport-local');

const fields = {
	usernameField: 'email',
	passwordField: 'password'
};

const verify = (
	email: string,
	password: string,
	done: DoneLocalCallback
): void => {
	db.get(
		'SELECT * FROM users WHERE email = ?',
		[email],
		function (err, user) {
			if (err) {
				done(err);
				return;
			}
			if (!user) {
				done(null, false, {
					message: 'Incorrect username or password!'
				});
				return;
				// @ts-expect-error nonexistent on type
			} else if (!user.hashed_password && !user.email) {
				done(null, false, {
					message: 'This username is registered with Google!'
				});
				return;
			}
			// @ts-expect-error nonexistent on type
			if (bcrypt.compareSync(password, user.hashed_password)) {
				// @ts-expect-error nonexistent on type
				done(null, user);
				return;
			}
			done(null, false, {
				message: 'Incorrect username or password!'
			});
		}
	);
};

export default new LocalStrategy(fields, verify);
