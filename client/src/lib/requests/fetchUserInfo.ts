import axios from 'axios';

export default async (): Promise<any> =>
	await axios
		.get('http://localhost:9999/user', { withCredentials: true })
		// .get('https://www.rubenstanciu.com/alimento/user', { withCredentials: true })
		.then((res) => {
			if (res.data.message !== undefined) {
				console.error(res.data.message);
				return res.data.message;
			}
			return res.data;
		});
