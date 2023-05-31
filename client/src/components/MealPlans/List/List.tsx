import { useEffect, type Dispatch, type FC } from 'react';

import type MealPlan from '../../../types/MealPlan';
import type MealPlanViewAction from '../../../types/MealPlanViewAction';
import capitalizeString from '../../../lib/utils/capitalizeString';

const SingleMealPlan: FC<{
    mealPlans: MealPlan[]
    mealPlansReqStatus: 'error' | 'idle' | 'loading' | 'success'
    setMealPlansView: Dispatch<MealPlanViewAction>
}> = ({
    mealPlans,
    mealPlansReqStatus,
    setMealPlansView
}) => {
        const addTooltips = (): void => {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                // @ts-expect-error bootstrap
                return new bootstrap.Tooltip(tooltipTriggerEl)
            });
        }

        useEffect(() => {
            addTooltips();
        }, []);

        return (
            <>
                <div className='my-3 d-flex gap-3 flex-wrap align-items-center justify-content-between p-3 bg-dark rounded'>
                    <p className='m-0 text-white d-flex'>
                        Today's selected plan is (-----).
                        <span
                            tabIndex={0}
                            className='help-tooltip--light ms-2'
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="The app choses a random meal plan everyday for you, but you can select another from the list below."
                        >
                            <span className='mx-2'>?</span>
                        </span>
                    </p>
                    <button
                        type='button'
                        className='btn btn-light'
                        onClick={() => {
                            setMealPlansView({ type: 'CHANGE_VIEW', payload: 'form' })
                        }}
                    >
                        Generate New Plan
                    </button>
                </div>
                <div className="d-flex flex-wrap gap-3 mt-3">
                    <form className='col-md-9 col-12 d-flex'>
                        <input className="form-control me-1" type="search" placeholder="Search in meal plans" aria-label="Search" />
                        <button className="btn btn-outline-secondary " type="submit">Search</button>
                    </form>
                    <div className='col'>
                        <div className="input-group">
                            <label className="input-group-text" htmlFor="">
                                <i className="bi bi-sort-alpha-down"></i>
                            </label>
                            <select
                                className="form-select"
                                aria-label="Filter select"
                                defaultValue='none'
                            >
                                <option value='none'>Sort By</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="diet">Diet (A-Z)</option>
                                <option value="protein">Protein (High to low)</option>
                                <option value="carbs">Carbohidrates (High to low)</option>
                                <option value="fat">Fat (High to low)</option>
                                <option value="kcal">Kilocalories (High to low)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className='row g-3 mt-3'>
                    {
                        mealPlansReqStatus === 'success'
                            ? <>
                                <p className='m-0 ms-1'>Meal Plans: {mealPlans.length}</p>
                                {mealPlans.map(plan =>
                                    <div key={plan.id} className="col-lg-4">
                                        <div className={'card p-1 ' + (plan.name === 'unnamed' ? '' : 'bg-primary')} >
                                            <div className="card-body bg-light">
                                                <h3 className='card-title mb-3'>
                                                    {capitalizeString(plan.name)}
                                                </h3>
                                                <ul className='list-unstyled'>
                                                    <li><b>Diet:</b> {capitalizeString(plan.diet)}</li>
                                                    <li><b>Kcal:</b> {plan.protein * 4 + plan.carbs * 4 + plan.fat * 9}</li>
                                                    <li><b>Protein:</b> {plan.protein}g</li>
                                                    <li><b>carbs:</b> {plan.carbs}g</li>
                                                    <li><b>fat:</b> {plan.fat}g</li>
                                                </ul>
                                                <div className='d-flex gap-3'>
                                                    <button
                                                        type='button'
                                                        className='btn btn-secondary m-0'
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
                                                    <button
                                                        type='button'
                                                        className='btn btn-outline-secondary m-0'
                                                        onClick={() => {

                                                        }}
                                                    >
                                                        Select for today
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                            : <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                    }
                </div>
            </>
        );
    }

export default SingleMealPlan;
