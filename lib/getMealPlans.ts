/* eslint-disable no-multi-str */
import { dbAll } from '../db';

import type MealPlan from '../types/mealPlan';

export default async (userID: number): Promise<MealPlan[]> => {
	return await dbAll(
		'SELECT * \
		FROM mealplans \
		WHERE user_id = ? \
		',
		[userID]
	);
};
