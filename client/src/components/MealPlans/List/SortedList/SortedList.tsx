import { type Dispatch, type FC } from 'react';

import type MealPlan from '../../../../types/MealPlan';
import type MealPlanViewAction from '../../../../types/MealPlanViewAction';
import capitalizeString from '../../../../lib/utils/capitalizeString';

const SortedList: FC<{
    sortedBy: string
    mealPlans: MealPlan[]
    selectedPlanId: number
    updateSelectedPlan: (id: number) => void
    setMealPlansView: Dispatch<MealPlanViewAction>
}> = ({
    sortedBy,
    mealPlans,
    selectedPlanId,
    updateSelectedPlan,
    setMealPlansView
}) => {
        const calculateKcal = (p: number, c: number, f: number): number => {
            return ((p + c) * 4) + f * 9;
        }

        const sortList = (plans: MealPlan[]): MealPlan[] => {
            switch (sortedBy) {
                case 'name':
                    return plans.sort((a, b) => a.name.localeCompare(b.name));
                case 'diet':
                    return plans.sort((a, b) => a.diet.localeCompare(b.diet));
                case 'carbs':
                    return plans.sort((a, b) => b.carbs - a.carbs);
                case 'protein':
                    return plans.sort((a, b) => b.protein - a.protein);
                case 'fat':
                    return plans.sort((a, b) => b.fat - a.fat);
                case 'kcal':
                    return plans.sort((a, b) => calculateKcal(b.protein, b.carbs, b.fat) - calculateKcal(a.protein, a.carbs, a.fat));
                case 'unsorted':
                default:
                    return plans;
            }
        }

        return (
            <>
                {sortList(mealPlans).map(plan =>
                    <div key={plan.id} className="col-lg-4">
                        <div className={'card p-1 ' + (plan.id === selectedPlanId ? 'selected-bg' : '')} >
                            <div className="card-body bg-light">
                                <h3 className='card-title mb-3 d-flex gap-3 align-items-center'>
                                    {capitalizeString(plan.name)}
                                    {
                                        plan.id === selectedPlanId && <span className='text-success fs-6 p-2 border border-success rounded'>Selected</span>
                                    }
                                </h3>
                                <ul className='list-unstyled'>
                                    <li><b>Diet:</b> {capitalizeString(plan.diet)}</li>
                                    <li><b>Kcal:</b> {plan.protein * 4 + plan.carbs * 4 + plan.fat * 9}</li>
                                    <li><b>Protein:</b> {plan.protein}g</li>
                                    <li><b>Carbs:</b> {plan.carbs}g</li>
                                    <li><b>Fat:</b> {plan.fat}g</li>
                                </ul>
                                <div className='d-flex gap-3'>
                                    <button
                                        type='button'
                                        className='btn btn-primary m-0'
                                        onClick={() => {
                                            setMealPlansView({
                                                type: 'SHOW_MEALPLAN',
                                                payload: {
                                                    type: 'single',
                                                    id: plan.id,
                                                    name: plan.name,
                                                    text: plan.text,
                                                    options: {
                                                        diet: plan.diet,
                                                        protein: plan.protein,
                                                        carbs: plan.carbs,
                                                        allergens: plan.allergens,
                                                        fat: plan.fat
                                                    }
                                                }
                                            })
                                        }}
                                    >
                                        View Plan
                                    </button>
                                    {
                                        plan.id !== selectedPlanId && <button
                                            type='button'
                                            className='btn btn-outline-success m-0'
                                            onClick={() => { updateSelectedPlan(plan.id); }}
                                        >
                                            Select for today
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

export default SortedList;
