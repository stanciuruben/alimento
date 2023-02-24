/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// @ts-expect-error next line
import LocalStrategy from 'passport-local';
import db from '../db';
import bcrypt from 'bcrypt';

type DoneLocalCalback = (err: any, user?: Express.User | false | null, options?: { message: string }) => void;

export default new LocalStrategy(function verify (username: string, password: string, done: DoneLocalCalback) {
	db.get(
		'SELECT * FROM users WHERE username = ?',
		[username],
		function (err, user) {
			if (err) {
				done(err);
                return;
			}
			if (!user) {
				done(null, false, {
					message: 'Incorrect username or password.'
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
                message: 'Incorrect username or password.'
            });
		}
	);
});
