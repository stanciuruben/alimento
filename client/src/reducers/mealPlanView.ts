import type MealPlanView from '../types/MealPlanView';
import type MealPlanViewAction from '../types/MealPlanViewAction';

export default function mealPlanViewReducer(
	state: MealPlanView,
	action: MealPlanViewAction
): MealPlanView {
	switch (action.type) {
		case 'CHANGE_NAME':
			return { ...state, name: action.payload.name };
		case 'CHANGE_VIEW':
			return { type: action.payload as MealPlanView['type'] };
		case 'SHOW_MEALPLAN':
			return action.payload as MealPlanView;
		default:
			return state;
	}
}