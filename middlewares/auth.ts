import { type Request, type Response, type NextFunction } from 'express';
// import { deserializeGoogleUser } from '../lib/googleStrategy';

export default (req: Request, res: Response, next: NextFunction): void => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).json({ message: 'You must log-in first to use this!' });
	}
};
