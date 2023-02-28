import db from '../db';

export default async (
	userID: number,
	tokens: number
): Promise<boolean | Error> => {
	try {
		db.run('UPDATE users SET tokens = ? WHERE id = ?', [
			tokens,
			userID
		]);
        return true;
	} catch (error: any) {
		return error;
	}
};
