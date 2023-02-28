import { dbGet } from '../db';

export default async (userID: number): Promise<number | Error> => {
	try {
		const user = await dbGet('SELECT tokens FROM users WHERE id = ?', [
			userID
		]);
		const tokens = user.tokens;
		if (tokens !== undefined) {
			return tokens;
		}
		throw new Error('Invalid request!');
	} catch (error: any) {
		return error;
	}
};
