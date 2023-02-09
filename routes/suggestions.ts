/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from 'express';
// import { body } from 'express-validator';
// import aiRequest from '../services/aiRequest';

interface reqParams {
    diet: string
    kcal: number
    protein: number
    carbs: number
    fat: number
    useMacros: boolean
    allergens: string[]
}

const router = express.Router();

// @route   POST
// @desc    Given parameters make a request to the openai api
// @desc    and return the response to the client
// @access  Private
router.post('/', async (req: Request, res: Response) => {
    const { allergens, diet, kcal, protein, carbs, fat, useMacros }: reqParams =
        req.body;
    try {
        const prompt: string = `Make a${diet === 'none' ? '' : ' ' + diet} meal plan for 1 day with ${
            useMacros
                ? String(protein) +
                  'g protein, ' +
                  String(carbs) +
                  'g carbs, ' +
                  String(fat) +
                  'g fat'
                : String(kcal) + ' kcalories'
        }.${
            allergens.length > 0
                ? ' And without the following allergens: ' +
                  allergens.join(', ') +
                  '.'
                : ''
        }`;
        res.json(prompt);
        // const response = await aiRequest('list a meal plan with the following macros: 55g protein, 55g fat, 10g net carbs')
        // res.send(response);
    } catch (error: any) {
        res.send(error);
    }
});

module.exports = router;
