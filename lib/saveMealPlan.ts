/* eslint-disable no-multi-str */
import { dbRun } from '../db';
import type mealPlanOptions from '../types/mealPlanOptions';

export default async (
	userID: number,
	text: string,
	{ diet, kcal, protein, carbs, fat, useMacros, allergens }: mealPlanOptions
): Promise<boolean | Error> => {
	return await dbRun(
		'INSERT INTO mealplans ( \
			owner_id, \
			text, \
			diet, \
			kcal, \
			protein, \
			carbs, \
			fat, \
			use_macros, \
			allergens, \
			date \
		) \
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \
		',
		[
			userID,
			text,
			diet,
			kcal,
			protein,
			carbs,
			fat,
			(useMacros ? 1 : 0),
			(allergens !== undefined ? allergens.join(', ') : ''),
			(new Date().toDateString())
		]
	);
};
