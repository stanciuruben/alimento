import express from 'express';
import passport from 'passport';
import googleStrategy, {
	serializeGoogleUser,
	deserializeGoogleUser
} from '../../lib/googleStrategy';

const router = express.Router();

passport.use(googleStrategy);
passport.serializeUser(serializeGoogleUser);
passport.deserializeUser(deserializeGoogleUser);
router.get('/federated', passport.authenticate('google'));
router.get(
	'/redirect',
	passport.authenticate('google', {
		successRedirect: 'http://localhost:5173', // https://alimento.rubenstanciu.com/app in production
		failureRedirect: '/login'
	})
);

module.exports = router;