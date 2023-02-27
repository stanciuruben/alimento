/* eslint-disable @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-var-requires */
import db from '../db';
import bcrypt from 'bcrypt';
const LocalStrategy = require('passport-local');

type DoneLocalCalback = (
	err: any,
	user?: Express.User | false | null,
	options?: { message: string }
) => void;

const fields = {
	usernameField: 'email',
	passwordField: 'password'
};

const verify = (
	email: string,
	password: string,
	done: DoneLocalCalback
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
			} else if (!user.hashed_password && !user.email) {
				done(null, false, {
					message: 'This username is registered with Google!'
				});
			}

			if (bcrypt.compareSync(password, user.hashed_password)) {
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
