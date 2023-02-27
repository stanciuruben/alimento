/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import db, { dbGet } from '../db';
import bcrypt from 'bcrypt';

interface requestBody {
	username: string
	email: string
	password: string
	repeatPassword: string
}

const START_BUDGET: number = 25;

export default async (
	{ username, email, password, repeatPassword }: requestBody,
	done: (error: string | null, message?: string) => void
): Promise<void> => {
	if (password !== repeatPassword) {
		done('The passwords must match!');
		return;
	}
	try {
		if (await dbGet('SELECT * FROM users WHERE username = ?', [username])) {
			done('Username already registered');
			return;
		}
		if (await dbGet('SELECT * FROM users WHERE email = ?', [username])) {
			done('Email already in registered!');
			return;
		}
		const salt: string = bcrypt.genSaltSync();
		const hashedPassword: string = bcrypt.hashSync(password, salt);
		db.run(
			'INSERT INTO users (username, hashed_password, salt, email, tokens) values (?, ?, ?, ?, ?)',
			[username, hashedPassword, salt, email, START_BUDGET],
			(err) => {
				if (err != null) {
                    done('Database Error: ' + JSON.stringify(err));
                    return;
				}
                done(null, 'Registration Successful!');
			}
		);
	} catch (err) {
		done('Database Error: ' + JSON.stringify(err));
	}
};
