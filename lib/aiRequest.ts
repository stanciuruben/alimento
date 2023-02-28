import config from 'config';
import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
    apiKey: config.get('OPENAI_AUTH-KEY')
});
const openai = new OpenAIApi(configuration);

export default async (prompt: string): Promise<any> => {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        temperature: 0,
        max_tokens: 500
    });
    return response.data.choices[0].text
};
