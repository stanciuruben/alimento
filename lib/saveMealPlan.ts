/* eslint-disable no-multi-str */
import { dbRun } from '../db';
import type mealPlanOptions from '../types/mealPlanOptions';

export default async (
	userID: number,
	text: string,
	{
		diet,
		protein,
		carbs,
		fat,
		useMacros,
		allergens
	}: Omit<mealPlanOptions, 'kcal'>
): Promise<boolean> => {
	try {
		await dbRun(
			'INSERT INTO mealplans ( \
				user_id, \
				name, \
				text, \
				diet, \
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
				'unnamed',
				text,
				diet,
				protein,
				carbs,
				fat,
				useMacros ? 1 : 0,
				allergens !== undefined ? allergens.join(', ') : '',
				new Date().toDateString()
			]
		);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};
