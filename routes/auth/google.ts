import express from 'express';
import passport from 'passport';
import googleStrategy from '../../lib/googleStrategy';

const router = express.Router();
passport.use(googleStrategy);

router.get('/federated', passport.authenticate('google'));
router.get(
	'/redirect',
	passport.authenticate('google', {
		successRedirect: 'http://localhost:5173', // https://alimento.rubenstanciu.com/app in production
		failureRedirect: '../login',
		failureMessage: true
	})
);

module.exports = router;
