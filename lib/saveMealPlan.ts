/* eslint-disable no-multi-str */
import { dbRun } from '../db';
import type mealPlanOptions from '../types/mealPlanOptions';

export default async (
	userID: number,
	text: string,
	{ diet, protein, carbs, fat, allergens }: Omit<mealPlanOptions, 'kcal'>
): Promise<number> => {
	try {
		return await dbRun(
			'INSERT INTO mealplans ( \
				user_id, \
				name, \
				text, \
				diet, \
				protein, \
				carbs, \
				fat, \
				allergens, \
				date \
			) \
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) \
			returning id',
			[
				userID,
				'unnamed',
				text,
				diet,
				protein,
				carbs,
				fat,
				allergens !== undefined ? allergens.join(', ') : '',
				new Date().toDateString()
			]
		);
	} catch (error) {
		console.error(error);
		return -1;
	}
};
