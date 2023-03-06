import type { Dispatch, SetStateAction, FC } from 'react';
import type MoreOptions from '../../types/MoreOptions';
import './MealPlans.css';
import { useQuery } from 'react-query';
import fetchMealPlans from '../../lib/fetchMealPlans';

interface Props {
	setDiet: Dispatch<SetStateAction<string>>
	setAllergens: Dispatch<SetStateAction<string[]>>
	setMoreOptions: Dispatch<SetStateAction<MoreOptions>>
	setMealPlan: Dispatch<SetStateAction<string>>
	setMealPlanTitle: Dispatch<SetStateAction<string>>
}

interface MealPlansInterface extends MoreOptions {
	diet: string
	allergens: string
	date: string
	text: string
}

const MealPlans: FC<Props> = ({
	setDiet,
	setAllergens,
	setMoreOptions,
	setMealPlan,
	setMealPlanTitle
}) => {
	const { isLoading, error, data } = useQuery({
		queryKey: ['mealplans'],
		queryFn: fetchMealPlans,
		retry: false,
		placeholderData: []
	});

	const setCurrentMealPlan = (mealPlan: MealPlansInterface): void => {
		setDiet(mealPlan.diet);
		setAllergens(
			mealPlan.allergens.length > 0 ? mealPlan.allergens.split(', ') : []
		);
		setMoreOptions({
			kcal: mealPlan.kcal,
			protein: mealPlan.protein,
			carbs: mealPlan.carbs,
			fat: mealPlan.fat,
			useMacros: !!mealPlan.useMacros
		});
		setMealPlanTitle(mealPlan.date);
		setMealPlan(mealPlan.text);
	};

	if (isLoading) {
		return (
			<ul className='meal_list'>
				<li className='meal_list__item'>
					<span>Loading...</span>
				</li>
			</ul>
		);
	}

	if (error !== undefined && error !== null) {
		return (
			<ul className='meal_list'>
				<li className='meal_list__item'>
					<span>An error has occurred</span>
				</li>
			</ul>
		);
	}

	return (
		<ul className='meal_list'>
			<h2 className='meal_list__title'>Generated Plans:</h2>
			{data?.length > 0
? (
				data.map((mealPlan: MealPlansInterface, index: number) => (
					<li
						key={mealPlan.date + index.toString()}
						className='meal_list__item'
					>
						<button
							onClick={() => {
								setCurrentMealPlan(mealPlan);
							}}
						>
							{mealPlan.date}
						</button>
					</li>
				))
			)
: (
				<li className='meal_list__item'>
					<span>No plans found</span>
				</li>
			)}
		</ul>
	);
};

export default MealPlans;
