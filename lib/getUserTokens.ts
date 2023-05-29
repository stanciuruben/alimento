import { dbGet } from '../db';

export default async (userID: number): Promise<number> => {
	try {
		const user = await dbGet('SELECT tokens FROM users WHERE id = ?', [
			userID
		]);
		const tokens = user.tokens;
		if (tokens !== undefined) {
			return tokens;
		}
		return -1;
	} catch (error: any) {
		return -1;
	}
};
