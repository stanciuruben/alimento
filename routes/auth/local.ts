/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import passport from 'passport';
import LocalStrategy from '../../lib/localStrategy';
import { body, validationResult } from 'express-validator';
import registerUser from '../../lib/registerUser';

const router = express.Router();
passport.use(LocalStrategy);

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: 'http://localhost:5173', // https://alimento.rubenstanciu.com/app in production
		failureRedirect: '/login',
		failureMessage: true
	})
);

router.post(
	'/register',
	body('username')
		.isLength({ min: 2 })
		.withMessage('Username too short!')
		.isString()
		.withMessage('Username must be a string!')
		.trim()
		.withMessage('Username must be a string!')
		.escape()
		.withMessage('Username must be a string!'),
	body('email')
		.not()
		.isEmpty()
		.withMessage('Email cannot be empty!')
		.isEmail()
		.withMessage('Email invalid!')
		.normalizeEmail()
		.withMessage('Email must be a string!'),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters!')
		.isString()
		.withMessage('Password must be a string!')
		.trim()
		.withMessage('Password must be a string!')
		.escape()
		.withMessage('Password must be a string!'),
	body('repeatPassword')
		.isLength({ min: 6 })
		.withMessage('Repeated password must be at least 6 characters!')
		.isString()
		.withMessage('Repeated password must be a string!')
		.trim()
		.withMessage('Repeated password must be a string!')
		.escape()
		.withMessage('Repeated password must be a string!'),
	async (req, res) => {
		const handleResponse = (
			error: string | null,
			message?: string
		): void => {
			if (error !== null) {
				res.status(400).json({ message: error });
				return;
			}
			if (message !== undefined) {
				res.status(200).json({ message });
				return;
			}
			res.status(500).json({ message: 'Something went wrong!' });
		};

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const errorMessages = errors.array().map((err) => err.msg);
			handleResponse(errorMessages.join(',\n'));
			return;
		}
		await registerUser(req.body, handleResponse);
	}
);

module.exports = router;
