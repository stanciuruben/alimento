/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from 'express';
import { body } from 'express-validator';
import aiRequest from '../services/aiRequest';
const router = express.Router();

// @route   GET
// @desc    Given parameters make a request to the openai api
// @desc    and return the response to the client
// @access  Private
router.get('/', async (_req: Request, res: Response) => {
    try {
        const response = await aiRequest('list a meal plan with the following macros: 55g protein, 55g fat, 10g net carbs')
        res.send(response);
    } catch (error: any) {
        res.send(error);
    }
});

module.exports = router;
