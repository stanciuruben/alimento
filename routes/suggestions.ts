/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from 'express';
import { body } from 'express-validator';
import config from 'config';
import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
    apiKey: config.get('OPENAI_AUTH-KEY')
});
const openai = new OpenAIApi(configuration);
const router = express.Router();

// @route   GET
// @desc    Given parameters make a request to the openai api
// @desc    and return the response to the client
// @access  Private
router.get('/', async (_req: Request, res: Response) => {
    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: 'breakfast suggestion with following macros: 50g protein, 50g fat, 10g carbs',
            temperature: 1,
            max_tokens: 150
        });
        res.send(response.data.choices);
    } catch (error: any) {
        res.send(error);
    }
});

module.exports = router;
