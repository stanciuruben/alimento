/* eslint-disable no-multi-str */
import { dbGet } from '../db';

export default async (userID: number, mealPlanID: number): Promise<any[] | Error> => {
	return await dbGet(
		'SELECT text, \
				diet, \
				kcal, \
				protein, \
				carbs, \
				fat, \
				use_macros, \
				allergens \
		FROM mealplans \
		WHERE owner_id = ? AND id = ? \
		',
		[userID, mealPlanID]
	);
};
