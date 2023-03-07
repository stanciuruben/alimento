import type { FC } from 'react';
import './MealPlans.css';
import { useQuery } from 'react-query';
import fetchMealPlans from '../../lib/fetchMealPlans';

interface Props {
	getOneMealPlan: (id: number) => void
}

const MealPlans: FC<Props> = ({ getOneMealPlan }) => {
	const { isLoading, error, data } = useQuery({
		queryKey: ['mealplans'],
		queryFn: fetchMealPlans,
		retry: false,
		placeholderData: []
	});

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
					data.map((mealPlan: { id: number, date: string }, index: number) => (
						<li
							key={mealPlan.date + index.toString()}
							className='meal_list__item'
						>
							<button
								onClick={() => {
									getOneMealPlan(mealPlan.id);
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
