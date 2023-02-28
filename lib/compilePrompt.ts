import type mealPlanOptions from '../types/mealPlanOptions';

export default ({
	allergens,
	diet,
	kcal,
	protein,
	carbs,
	fat,
	useMacros
}: mealPlanOptions): string =>
	`Make a${diet === 'none' ? '' : ' ' + diet} meal plan for 1 day with ${
		useMacros
			? String(protein) +
			  'g protein, ' +
			  String(carbs) +
			  'g carbs, ' +
			  String(fat) +
			  'g fat'
			: String(kcal) + ' kcalories'
	}.${
		allergens.length > 0
			? ' And without the following allergens: ' +
			  allergens.join(', ') +
			  '.'
			: ''
	}`;
