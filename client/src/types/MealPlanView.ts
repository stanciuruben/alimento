import type Options from './Options';

export default interface MealPlanView {
	type: 'form' | 'list' | 'single';
	options?: Options;
	name?: string;
	text?: string;
}
