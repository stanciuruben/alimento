/* eslint-disable no-multi-str */
import { dbRun } from '../db';

import formatDate from './formatDate';

export default async (userId: number, planId: number): Promise<number> => {
	try {
		return await dbRun(
			'INSERT INTO selected_plans ( \
				user_id, \
				plan_id, \
                date \
			) \
			VALUES (?, ?, ?) \
			returning id',
			[userId, planId, formatDate(new Date())]
		);
	} catch (error) {
		return -1;
	}
};
