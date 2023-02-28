/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from 'express';
import auth from '../../middlewares/auth';
import aiRequest from '../../lib/aiRequest';
import { body, validationResult } from 'express-validator';
import compilePrompt from '../../lib/compilePrompt';
import getUserTokens from '../../lib/getUserTokens';
import updateUserTokens from '../../lib/updateUserTokens';
import saveMealPlan from '../../lib/saveMealPlan';

const router = express.Router();

// @route   POST
// @desc    Given parameters save update the database make request
// @desc    to the openai api and return the response to the client
// @access  Private
router.post(
	'/',
	auth,
	body('diet').trim().escape(),
	body('allergens')
		.isArray({ max: 30 })
		.withMessage('allergens must be an array'),
	body('kcal').isNumeric(),
	body('protein').isNumeric(),
	body('carbs').isNumeric(),
	body('fat').isNumeric(),
	body('useMacros').isBoolean(),
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);
			if (
				req.user === undefined ||
				req.user.id === undefined ||
				!errors.isEmpty()
			) {
				res.status(400).json({ message: 'Bad request.' });
				return;
			}
			const userID: number = req.user.id;
			const tokens: number | Error = await getUserTokens(userID);
			if (typeof tokens === 'object') {
				throw tokens;
			}
			if (tokens < 1) {
				res.status(403).json({ message: 'No Founds.' });
				return;
			}
			req.user.tokens = tokens - 1;
			const isUserUpdated: boolean | Error = await updateUserTokens(
				userID,
				tokens - 1
			);
			if (isUserUpdated === true) {
				const prompt: string = compilePrompt(req.body);
				const response: string = await aiRequest(prompt);
				const isSaved: boolean | Error = await saveMealPlan(userID, response);
				if (isSaved === true) {
					res.status(200).json(response);
					return;
				}
				throw new Error('Meal plan could not be saved.');
			}
			throw new Error('Something went wrong.');
		} catch (error: any) {
			res.status(500).json(error);
		}
	}
);

module.exports = router;
