/* eslint-disable no-multi-str */
import { dbRun } from '../db';

import formatDate from './formatDate';

export default async (userId: number, planId: number): Promise<number> => {
	try {
		return await dbRun(
			'UPDATE selected_plans SET plan_id = ? WHERE user_id = ? AND date = ?;',
			[planId, userId, formatDate(new Date())]
		);
	} catch (error) {
		return -1;
	}
};
