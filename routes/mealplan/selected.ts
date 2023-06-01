/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from 'express';
import { body, validationResult } from 'express-validator';

import getMealPlans from '../../lib/getMealPlans';
import getSelectedMealPlans from '../../lib/getSelectedMealPlans';
import createMealPlanSelection from '../../lib/createMealPlanSelection';
import updateMealPlanSelection from '../../lib/updateMealPlanSelection';
import formatDate from '../../lib/formatDate';

import auth from '../../middlewares/auth';

const router = express.Router();

// @route   UPDATE
// @desc    Update today's selection
// @access  Protected
router.patch(
	'/',
	auth,
	body('id').isNumeric(),
	async (req: Request, res: Response) => {
		try {
			// Validate request
			const errors = validationResult(req);
			if (
				req.user === undefined ||
				req.user.id === undefined ||
				!errors.isEmpty()
			) {
				return res.status(401).json({ message: 'Unauthenticated' });
			}
			console.log(
				req.body.id,
				await updateMealPlanSelection(req.user.id, req.body.id)
			);
			res.status(200).json({ isUpdated: true });
		} catch (error: any) {
			res.status(500).json({ message: error.message, isUpdated: false });
		}
	}
);

// @route   GET
// @desc    Return all selected meal plans
// @access  Protected
router.get('/', auth, async (req: Request, res: Response) => {
	try {
		if (req.user === undefined || req.user.id === undefined) {
			res.status(401).json({
				message: 'You must be authenticated to access this data.'
			});
			return;
		}
		const selected = await getSelectedMealPlans(req.user.id);

		// Meal plan for today is already selected return query result
		const today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		today.setMilliseconds(0);
		if (
			(selected.length > 1 &&
				new Date(selected[0].date).getTime() === today.getTime()) ||
			selected.length === 0
		) {
			return res.status(200).json(selected);
		}

		// Create a new random meal plan selection for user
		const mealPlans = await getMealPlans(req.user.id);
		if (mealPlans.length === 0) {
			return res.status(200).json(selected);
		}
		const randomMealPlanIndex: number = Math.floor(
			Math.random() * mealPlans.length
		);
		selected.unshift({
			plan_id: mealPlans[randomMealPlanIndex].id,
			date: formatDate(new Date())
		});
		await createMealPlanSelection(
			req.user.id,
			mealPlans[randomMealPlanIndex].id
		);
		res.status(200).json(selected);
	} catch (error: any) {
		res.status(500).json(error.message);
	}
});

module.exports = router;
