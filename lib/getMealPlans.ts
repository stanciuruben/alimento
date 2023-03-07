/* eslint-disable no-multi-str */
import { dbAll } from '../db';

export default async (userID: number): Promise<any[] | Error> => {
	return await dbAll(
		'SELECT id, \
				date \
		FROM mealplans \
		WHERE owner_id = ? \
		',
		[userID]
	);
};
