import type MainView from '../types/MainView';
import type MainViewAction from '../types/MainViewAction';

export default function mainViewReducer(
	state: MainView,
	action: MainViewAction
): MainView {
	switch (action.type) {
		case 'statistics':
		case 'mealplans':
		case 'account':
			return { current: action.type, previous: action.previous };
		default:
			return state;
	}
}
