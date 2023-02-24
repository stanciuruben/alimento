/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import LocalStrategy from '../../lib/localStrategy';
import db from '../../db';
import { param, validationResult } from 'express-validator';

const router = express.Router();
const START_BUDGET: number = 25;
passport.use(LocalStrategy);

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: 'http://localhost:5173', // https://alimento.rubenstanciu.com/app in production
		failureRedirect: '/login'
	})
);

router.post(
	'/register',
	param('username')
		.isLength({ min: 2 })
		.withMessage('Username too short!')
		.isString()
		.withMessage('Username must be a string!')
		.trim()
		.withMessage('Username must be a string!')
		.escape()
		.withMessage('Username must be a string!'),
	param('email')
		.not()
		.isEmpty()
		.withMessage('Email cannot be empty!')
		.isEmail()
		.withMessage('Email invalid!')
		.normalizeEmail()
		.withMessage('Email must be a string!'),
	param('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters!')
		.isString()
		.withMessage('Password must be a string!')
		.trim()
        .withMessage('Password must be a string!')
		.escape()
        .withMessage('Password must be a string!'),
	param('repeatPassword')
		.isLength({ min: 6 })
		.withMessage('Repeated password must be at least 6 characters!')
		.isString()
		.withMessage('Repeated password must be a string!')
		.trim()
        .withMessage('Repeated password must be a string!')
		.escape()
        .withMessage('Repeated password must be a string!'),
	(req, res) => {
		try {
			const { username, email, password, repeatPassword }: any =
				req.params;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const errorMessages = errors.array().map((err) => err.msg);
				throw new Error(errorMessages.join(',\n'));
			}
			if (password !== repeatPassword) {
				throw new Error('The passwords must match!');
			}
			db.get(
				'SELECT * FROM users WHERE username = ?',
				[username],
				(err, user) => {
					if (err) {
						throw err;
					}
					if (user) {
						throw new Error('Username already registered');
					}
				}
			);
			db.get(
				'SELECT * FROM users WHERE email = ?',
				[email],
				(err, user) => {
					if (err) {
						throw err;
					}
					if (user) {
						throw new Error('Email already in registered!');
					}
				}
			);
			const salt: string = bcrypt.genSaltSync();
			const hashedPassword: string = bcrypt.hashSync(password, salt);

			db.run(
				'INSERT INTO users (username, hashed_password, salt, email, tokens) values (?, ?, ?, ?, ?)',
				[username, hashedPassword, salt, email, START_BUDGET],
				(err) => {
					if (err != null) {
						throw err;
					}
					res.status(200).json({
						message:
							'Congratulations! Your registration was successful!'
					});
				}
			);
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	}
);

module.exports = router;
