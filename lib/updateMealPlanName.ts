import { dbGet } from '../db';

export default async (userID: number, name: string): Promise<boolean> => {
	try {
		return Boolean(
			await dbGet('UPDATE mealplans SET name = ? WHERE user_id = ?', [
				name,
				userID
			])
		);
	} catch (error: any) {
		return false;
	}
};
