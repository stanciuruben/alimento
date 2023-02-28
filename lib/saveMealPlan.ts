import { dbRun } from '../db';

export default async (
	userID: number,
	text: string
): Promise<boolean | Error> => {
	return await dbRun('INSERT INTO mealplans (owner_id, text) VALUES (?, ?)', [
		userID,
		text
	]);
};
