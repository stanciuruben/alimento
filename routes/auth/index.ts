/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/strict-boolean-expressions */
import express, {
	type Request,
	type Response,
	type NextFunction
} from 'express';
import path from 'path';

const router = express.Router();

router.use('/google', require('./google'));
router.use('/local', require('./local'));
router.get('/login', (req, res) => {
	// @ts-expect-error unkown property
	const messages = req.session.messages;
	// @ts-expect-error unkown property
	req.session.messages = [];
	res.render(path.join(__dirname, '../../../landingpage/login'), {
		messages
	});
});
router.get('/register', (req, res) => {
	// @ts-expect-error unkown property
	const messages = req.session.messages;
	// @ts-expect-error unkown property
	req.session.messages = [];
	res.render(path.join(__dirname, '../../../landingpage/register'), {
		messages
	});
});
router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
	req.logout((err) => {
		if (err) {
			next(err);
			return;
		}
		res.redirect('/');
	});
});

module.exports = router;
