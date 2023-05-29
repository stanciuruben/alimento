/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from 'express';
import { param, body, validationResult } from 'express-validator';

import aiRequest from '../../lib/aiRequest';
import compilePrompt from '../../lib/compilePrompt';
import getUserTokens from '../../lib/getUserTokens';
import updateUserTokens from '../../lib/updateUserTokens';
import saveMealPlan from '../../lib/saveMealPlan';
import updateMealPlanName from '../../lib/updateMealPlanName';
import getOneMealPlan from '../../lib/getOneMealPlan';
import getMealPlans from '../../lib/getMealPlans';

import auth from '../../middlewares/auth';
import getMacros from '../../lib/getMacros';

const router = express.Router();

// @route   GET
// @desc    Given the user authentication return
// @desc	all mealplans generated by that user
// @access  Public
router.get(
	'/:id',
	auth,
	param('id').isNumeric(),
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Bad request.' });
			return;
		}
		const id: number = parseInt(req.params.id);
		if (req.user === undefined || req.user.id === undefined) {
			res.status(200).json({
				message: 'You must be authenticated to access this data.'
			});
			return;
		}
		const mealPlan: Error | any = await getOneMealPlan(req.user.id, id);
		res.json(mealPlan);
	}
);

// @route   GET
// @desc    Given the user authentication return
// @desc	all mealplans generated by that user
// @access  Public
router.get('/getall', auth, async (req: Request, res: Response) => {
	if (req.user === undefined || req.user.id === undefined) {
		res.status(200).json({
			message: 'You must be authenticated to access this data.'
		});
		return;
	}
	const mealPlans: Error | any[] = await getMealPlans(req.user.id);
	res.json(mealPlans);
});

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
			// Validate request
			const errors = validationResult(req);
			if (
				req.user === undefined ||
				req.user.id === undefined ||
				!errors.isEmpty()
			) {
				return res.status(400).json({ message: 'Bad Request' });
			}

			// Check balance
			const tokens: number = await getUserTokens(req.user.id);
			if (tokens < 1) {
				return res.status(403).json({ message: 'No Funds' });
			}
			// Update balance
			req.user.tokens = tokens - 1;
			await updateUserTokens(req.user.id, tokens - 1);

			// Get macros
			let protein: number = req.body.protein;
			let carbs: number = req.body.carbs;
			let fat: number = req.body.fat;
			if (req.body.useMacros === false) {
				const macros = getMacros(req.body.diet, req.body.kcal);
				protein = macros.protein;
				carbs = macros.carbs;
				fat = macros.fat;
			}
			// Make request to ChatGPT
			const prompt: string = compilePrompt({
				diet: req.body.diet,
				allergens: req.body.allergens,
				protein,
				carbs,
				fat
			});
			const mealPlan: string = await aiRequest(prompt);
			// Save Meal Plan
			if (req.body.useMacros === false) {
				console.log(
					await saveMealPlan(req.user.id, mealPlan, {
						diet: req.body.diet,
						protein,
						carbs,
						fat,
						useMacros: false,
						allergens: req.body.allergens
					})
				);
			} else {
				console.log(
					await saveMealPlan(req.user.id, mealPlan, req.body)
				);
			}
			// Send Response
			res.status(200).json(mealPlan);
		} catch (error: any) {
			res.status(500).json(error.message);
		}
	}
);

// @route   PATCH
// @desc    Given the user authentication return
// @desc	all mealplans generated by that user
// @access  Public
router.patch(
	'/',
	auth,
	body('name').trim().escape(),
	async (req: Request, res: Response) => {
		// Validate request
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Bad request.' });
			return;
		}
		if (req.user === undefined || req.user.id === undefined) {
			return res.status(401).json({
				message: 'You must be authenticated to update mealplans.'
			});
		}
		// Update Meal Plan Name and send response
		if (await updateMealPlanName(req.user.id, req.body.name)) {
			return res.status(200).json({
				name: req.body.name
			});
		}
		// Send error response
		res.status(500).json({
			message: 'Something went wrong. Name not updated.'
		});
	}
);

module.exports = router;
