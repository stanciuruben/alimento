import type Options from './Options';

export default interface MealPlanView {
	type: 'form' | 'list' | 'single';
	id?: number;
	options?: Options;
	name?: string;
	text?: string;
}
