import axios from 'axios';

export default async (): Promise<any> =>
    await axios
    .get('https://www.rubenstanciu.com/alimento/mealplan/getall', { withCredentials: true })
    .then(res => res.data);
