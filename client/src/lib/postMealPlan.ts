import axios from 'axios';

function ltrim(str: string): string {
	if (str.length === 0) return str;
	return str.replace(/^\s+/g, '');
}

export default async (body: any): Promise<any> =>
	await axios
		.post('http://localhost:9999/mealplan', {
			// .post('https://www.rubenstanciu.com/alimento/mealplan', {
			headers: {
				'Content-Type': 'application/json',
				withCredentials: true
			},
			body: JSON.stringify(body)
		})
		.then((res) => {
			if (res.data.message !== undefined) {
				console.error(res.data.message);
				return res.data.message;
			}
			return ltrim(res.data);
		})
		.catch((err): void => {
			console.error(err);
		});
