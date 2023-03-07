import axios from 'axios';

export default async (): Promise<any> =>
    await axios
    // .get('http://localhost:9999/mealplan/getall', { withCredentials: true })
    .get('https://www.rubenstanciu.com/alimento/mealplan/getall', { withCredentials: true })
    .then(res => res.data);
