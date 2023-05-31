import { dbRun } from '../db';

export default async (
	userID: number,
	name: string,
	id: number
): Promise<boolean> => {
	try {
		return Boolean(
			await dbRun(
				'UPDATE mealplans SET name = ? WHERE user_id = ? AND id = ?',
				[name, userID, id]
			)
		);
	} catch (error: any) {
		return false;
	}
};
