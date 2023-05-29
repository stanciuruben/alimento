let proteinRatio: number;
let carbsRatio: number;
let fatRatio: number;

export default (
	diet: string,
	kcal: number
): {
	protein: number;
	carbs: number;
	fat: number;
} => {
	switch (diet) {
		case 'keto':
			proteinRatio = 0.38;
			carbsRatio = 0.04;
			fatRatio = 0.58;
			break;
		case 'paleo':
			proteinRatio = 0.35;
			carbsRatio = 0.15;
			fatRatio = 0.5;
			break;
		case 'mediterranean':
			proteinRatio = 0.36;
			carbsRatio = 0.3;
			fatRatio = 0.34;
			break;
		default:
			proteinRatio = 0.3;
			carbsRatio = 0.45;
			fatRatio = 0.25;
			break;
	}

	return {
		protein: Math.round((kcal * proteinRatio) / 4),
		carbs: Math.round((kcal * carbsRatio) / 4),
		fat: Math.round((kcal * fatRatio) / 9)
	};
};
