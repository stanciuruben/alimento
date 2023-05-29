import type MealPlanView from './MealPlanView';

export default interface MealPlanViewAction {
	type: 'CHANGE_VIEW' | 'CHANGE_NAME' | 'SHOW_MEALPLAN';
	payload:
		| 'list'
		| 'form'
		| (Omit<MealPlanView, 'type'> & { type: 'single' })
		| { name: string };
}
