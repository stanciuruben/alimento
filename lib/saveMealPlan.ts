/* eslint-disable no-multi-str */
import { dbRun } from '../db';
import type mealPlanOptions from '../types/mealPlanOptions';

export default async (
	userID: number,
	text: string,
	{ diet, protein, carbs, fat, allergens }: Omit<mealPlanOptions, 'kcal'>
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
				allergens, \
				date \
			) \
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) \
			',
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
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};
