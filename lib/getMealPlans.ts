/* eslint-disable no-multi-str */
import { dbAll } from '../db';

export default async (userID: number): Promise<any[] | Error> => {
	return await dbAll(
		'SELECT text, \
				diet, \
				kcal, \
				protein, \
				carbs, \
				fat, \
				use_macros, \
				allergens, \
				date \
		FROM mealplans \
		WHERE owner_id = ? \
		',
		[userID]
	);
};
