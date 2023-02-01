import express, { Request, Response } from 'express';
const { body } = require('express-validator');
const router = express.Router();
const config = require('config');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: config.get('OPENAI_AUTH-KEY'),
});
const openai = new OpenAIApi(configuration);

// @route   GET
// @desc    Given parameters make a request to the openai api
// @desc    and return the response to the client
// @access  Private
router.get('/', async (req: Request, res: Response) => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "give me a breakfast recipe with 50g of protein and 10g of net carbs",
    });
    res.send(response.data);
});

module.exports = router;