import express, { type Request, type Response } from 'express';
import path from 'path';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
	res.sendFile(path.resolve(__dirname, '../../../homepage/client/index.html'));
});

module.exports = router;
