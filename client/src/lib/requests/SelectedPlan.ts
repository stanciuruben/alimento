import axios from 'axios';
import URLS from '../urls.json';

const mealPlanUrl = import.meta.env.DEV
	? URLS.DEV.MEALPLAN
	: URLS.PROD.MEALPLAN;

class MealPlanRequest {
	async get(): Promise<any> {
		return await axios
			.get(mealPlanUrl + '/selected', {
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

	async update(id: number): Promise<any> {
		return await axios
			.patch(mealPlanUrl + '/selected', JSON.stringify({ id }), {
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
