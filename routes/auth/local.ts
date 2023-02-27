/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import passport from 'passport';
import LocalStrategy from '../../lib/localStrategy';
import { body } from 'express-validator';
import registerUser from '../../lib/registerUser';
import authSanitization from '../../middlewares/authSanitization';

const router = express.Router();
passport.use(LocalStrategy);

router.post(
	'/login',
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
	authSanitization,
	passport.authenticate('local', {
		successRedirect: 'http://localhost:5173', // https://alimento.rubenstanciu.com/app in production
		failureRedirect: '../login',
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
	authSanitization,
	async (req, res) => {
		const handleResponse = (
			error: string | null,
			message?: string
		): void => {
			if (error !== null) {
				// @ts-expect-error unkown property
				req.session.messages = [error];
				res.redirect('../register');
				return;
			}
			if (message !== undefined) {
				// @ts-expect-error unkown property
				req.session.messages = [message];
				res.redirect('../login');
				return;
			}
			// @ts-expect-error unkown property
			req.session.messages = ['Something went wrong!'];
			res.redirect('../register');
		};

		await registerUser(req.body, handleResponse);
	}
);

module.exports = router;
