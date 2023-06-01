/* eslint-disable no-multi-str */
import { dbAll } from '../db';

export default async (
	userID: number
): Promise<Array<{ plan_id: number; date: string }>> => {
	return await dbAll(
		'SELECT plan_id, date \
		FROM selected_plans \
		WHERE user_id = ? \
		ORDER BY date DESC \
		',
		[userID]
	);
};
