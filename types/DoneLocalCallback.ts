export type DoneLocalCallback = (
	err: any,
	user?: Express.User | false | null,
	options?: { message: string }
) => void;
