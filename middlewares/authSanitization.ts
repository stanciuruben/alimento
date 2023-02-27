import { type Request, type Response, type NextFunction } from 'express';
import { validationResult } from 'express-validator';

export default (req: Request, res: Response, next: NextFunction): void => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
        next();
		return;
	}
    const referer: string = req.headers.referer ?? '';
    const path = referer.match(/(\/*\w+)$/);
    if (path === null) {
        res.redirect('/');
        return;
    }
    const errorMessages = errors.array().map((err) => err.msg);
    // @ts-expect-error unkown property
    req.session.messages = [...errorMessages];
	res.redirect(`..${path[0]}`);
};
