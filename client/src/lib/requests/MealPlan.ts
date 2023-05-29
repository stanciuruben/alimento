import axios from 'axios';
import URLS from '../urls.json';

const mealPlanUrl = import.meta.env.DEV
	? URLS.DEV.MEALPLAN
	: URLS.PROD.MEALPLAN;

class MealPlanRequest {
	async create(body: any): Promise<any> {
		return await axios
			.post(mealPlanUrl, JSON.stringify(body), {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((res) => {
				if (res.data.message !== undefined) {
					throw new Error(res.data.message);
				}
				return res.data;
			});
	}

	async update(name: string): Promise<any> {
		return await axios
			.patch(mealPlanUrl, JSON.stringify({ name }), {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then((res) => {
				if (res.data.message !== undefined) {
					throw new Error(res.data.message);
				}
				return res.data;
			});
	}
}

export default MealPlanRequest;
