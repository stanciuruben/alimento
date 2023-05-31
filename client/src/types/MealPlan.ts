export default interface MealPlan {
	name: string;
	text: string;
	id: number;
	diet: string;
	allergens: string[];
	protein: number;
	carbs: number;
	fat: number;
}
