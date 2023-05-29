import type mealPlanOptions from '../types/mealPlanOptions';

export default ({
	diet,
	allergens,
	protein,
	carbs,
	fat
}: Omit<mealPlanOptions, 'useMacros' | 'kcal'>): string =>
	`Make a${diet === 'none' ? '' : ' ' + diet} meal plan for 1 day with ${
		String(protein) +
		'g protein, ' +
		String(carbs) +
		'g carbs, ' +
		String(fat) +
		'g fat'
	}.${
		allergens !== undefined && allergens.length > 0
			? ' And without the following allergens: ' +
			  allergens.join(', ') +
			  '.'
			: ''
	}`;
