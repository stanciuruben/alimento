/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/strict-boolean-expressions */
import express, { type Request, type Response, type NextFunction } from 'express';

const router = express.Router();

router.use('/google', require('./google'));
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
