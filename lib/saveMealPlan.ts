/* eslint-disable no-multi-str */
import { dbGet } from '../db';

import type mealPlanOptions from '../types/mealPlanOptions';
import formatDate from './formatDate';

export default async (
	userId: number,
	text: string,
	{ diet, protein, carbs, fat, allergens }: Omit<mealPlanOptions, 'kcal'>
): Promise<number> => {
	try {
		return await dbGet(
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
				userId,
				'unnamed',
				text,
				diet,
				protein,
				carbs,
				fat,
				allergens !== undefined ? allergens.join(', ') : '',
				formatDate(new Date())
			]
		);
	} catch (error) {
		return -1;
	}
};
