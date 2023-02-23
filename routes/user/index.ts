import express, { type Request, type Response, type Express } from 'express';
import auth from '../../middlewares/auth';

const router = express.Router();

// @route   POST
// @desc    Return authenticated user data
// @access  Private
router.get('/', auth, (req: Request, res: Response) => {
	try {
		const user: Express.User | undefined = req.user;
		if (user !== undefined) {
			const data = {
				name: user.username,
				tokens: user.tokens
			}
			return res.status(200).json(data);
		}
		throw new Error('No user found in request object');
	} catch (error: any) {
		return res.send(error);
	}
});

module.exports = router;
