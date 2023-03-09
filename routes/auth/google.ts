import express from 'express';
import passport from 'passport';
import googleStrategy from '../../lib/googleStrategy';

const router = express.Router();
passport.use(googleStrategy);

router.get('/federated', passport.authenticate('google'));
router.get(
	'/redirect',
	passport.authenticate('google', {
		successRedirect: 'https://www.rubenstanciu.com/alimento/client/',
		failureRedirect: 'https://www.rubenstanciu.com/alimento/login',
		failureMessage: true
	})
);

module.exports = router;
