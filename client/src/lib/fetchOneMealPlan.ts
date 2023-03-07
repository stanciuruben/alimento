import axios from 'axios';

export default async (id: number): Promise<any> =>
    await axios
    // .get(`http://localhost:9999/mealplan/getone/${id}`, { withCredentials: true })
    .get(`https://www.rubenstanciu.com/alimento/mealplan/getone/${id}`, { withCredentials: true })
    .then(res => res.data);
