/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from 'express';
// import aiRequest from '../services/aiRequest';
// import { body } from 'express-validator';

interface reqParams {
	diet: string
	kcal: number
	protein: number
	carbs: number
	fat: number
	useMacros: boolean
	allergens: string[]
}

const router = express.Router();

// @route   POST
// @desc    Given parameters make a request to the openai api
// @desc    and return the response to the client
// @access  Private
router.post('/', async (req: Request, res: Response) => {
	const { allergens, diet, kcal, protein, carbs, fat, useMacros }: reqParams =
		req.body;
	try {
		const prompt: string = `Make a${
			diet === 'none' ? '' : ' ' + diet
		} meal plan for 1 day with ${
			useMacros
				? String(protein) +
				  'g protein, ' +
				  String(carbs) +
				  'g carbs, ' +
				  String(fat) +
				  'g fat'
				: String(kcal) + ' kcalories'
		}.${
			allergens.length > 0
				? ' And without the following allergens: ' +
				  allergens.join(', ') +
				  '.'
				: ''
		}`;
		// const response = await aiRequest(prompt);
		setTimeout(() => {
			res.send([
				{
					text: '\n\nBreakfast:\n\n2 eggs cooked in butter with 2 slices of bacon and 1/2 avocado\n\nSnack:\n\n1/4 cup of macadamia nuts\n\nLunch:\n\nSalad with grilled chicken, olive oil, and feta cheese\n\nSnack:\n\n1/4 cup of almonds\n\nDinner:\n\nGrilled salmon with a side of sautéed spinach and mushrooms cooked in butter\n\nSnack:\n\n1/2 cup of Greek yogurt with 1 tablespoon of almond butter'
				}
			]);
		}, 1000);
	} catch (error: any) {
		res.send(error);
	}
});

module.exports = router;
