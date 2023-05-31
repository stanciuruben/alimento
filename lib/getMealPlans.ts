/* eslint-disable no-multi-str */
import { dbAll } from '../db';

export default async (userID: number): Promise<any[] | Error> => {
	return await dbAll(
		'SELECT * \
		FROM mealplans \
		WHERE user_id = ? \
		',
		[userID]
	);
};
