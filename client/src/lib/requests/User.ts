import axios from 'axios';
import URLS from '../urls.json';

const userUrl = import.meta.env.DEV ? URLS.DEV.USER : URLS.PROD.USER;

class UserRequest {
	async get(): Promise<{ name: string; tokens: number }> {
		return await axios
			.get(userUrl, {
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

export default UserRequest;
