export const serializeUser = (user: any, done: any): any => {
	process.nextTick(() => {
		done(null, { id: user.id, username: user.name, tokens: user.tokens });
	});
};

export const deserializeUser = (user: any, done: any): any => {
	process.nextTick(() => {
		return done(null, user);
	});
};
