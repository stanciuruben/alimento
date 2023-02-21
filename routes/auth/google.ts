/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import express, { type Request, type Response } from 'express';
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
		successRedirect: '/', // https://alimento.rubenstanciu.com/app in production
		failureRedirect: '/login'
	})
);

router.post('/logout', (req: Request, res: Response, next) => {
	req.logout((err) => {
		if (err) {
			next(err);
			return;
		}
		res.redirect('/');
	});
});

module.exports = router;
