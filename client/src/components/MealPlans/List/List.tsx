import { useEffect, type Dispatch, type FC, useState } from 'react';
import { useMutation } from 'react-query';
import './List.css';

import type ErrorModalType from '../../../types/ErrorModal';
import type MealPlan from '../../../types/MealPlan';
import type MealPlanViewAction from '../../../types/MealPlanViewAction';
import capitalizeString from '../../../lib/utils/capitalizeString';
import SelectedPlanRequest from '../../../lib/requests/SelectedPlan';
import urls from '../../../lib/urls.json';

import ErrorModal from '../../ErrorModal/ErrorModal';

const SingleMealPlan: FC<{
    setMealPlansView: Dispatch<MealPlanViewAction>
    mealPlans: MealPlan[]
    mealPlansReqStatus: 'error' | 'idle' | 'loading' | 'success'
    selectedPlans: Array<{ plan_id: number, date: string }>
    selectedPlansReqStatus: 'error' | 'idle' | 'loading' | 'success'
}> = ({
    setMealPlansView,
    mealPlans,
    mealPlansReqStatus,
    selectedPlans,
    selectedPlansReqStatus
}) => {
        const [error, setError] = useState<ErrorModalType | null>(null);
        const [selectedPlanId, setSelectedPlanId] = useState<number>(-1);
        const selectMutation = useMutation({
            mutationFn: new SelectedPlanRequest().update,
            onSuccess: (data, id) => {
                if (data.isUpdated === true) {
                    setSelectedPlanId(id);
                    return;
                }
                setError({
                    title: 'Something went wrong',
                    text: 'Server Error. If after a page reload the error persists contact support!',
                    children: <button
                        type='button'
                        onClick={() => { setError(null); }}
                        className='btn btn-secondary'>
                        Close
                    </button>
                })
            },
            onError: (err: any) => {
                if (err.response?.status !== undefined && err.response.status === 401) {
                    setError({
                        title: 'Unauthenticated',
                        text: 'Your session has expired, please login to continue using the app',
                        children: <>
                            <a className='btn btn-secondary' href={import.meta.env.DEV ? urls.DEV.LOGIN : urls.PROD.LOGIN}>Log-in</a>
                            <a className='btn' href={import.meta.env.DEV ? urls.DEV.REGISTER : urls.PROD.REGISTER}>Register</a>
                        </>
                    });
                    return;
                }
                setError({
                    title: 'Something went wrong',
                    text: err.message as string + '. If after a page reload the error persists contact support!',
                    children: <button
                        type='button'
                        onClick={() => { setError(null); }}
                        className='btn btn-secondary'>
                        Close
                    </button>
                })
            }
        })

        const addTooltips = (): void => {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                // @ts-expect-error bootstrap
                return new bootstrap.Tooltip(tooltipTriggerEl)
            });
        }

        useEffect(() => {
            if (selectedPlansReqStatus === 'success') {
                setSelectedPlanId(selectedPlans[0].plan_id);
            }
        }, [selectedPlansReqStatus])

        useEffect(() => {
            addTooltips();
        }, []);

        return (
            <>
                <div className='my-4 d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between p-3 bg-dark rounded'>
                    <p className='m-0 text-white d-flex flex-wrap gap-2 align-items-center justify-content-center'>
                        Today's selected plan is
                        {
                            (() => {
                                if (selectedPlansReqStatus === 'success' && mealPlansReqStatus === 'success') {
                                    for (let i = 0; i < mealPlans.length; i++) {
                                        if (mealPlans[i].id === selectedPlanId) {
                                            return <>
                                                <b>{mealPlans[i].name}</b>
                                                <button
                                                    type='button'
                                                    className='btn btn-sm btn-outline-light'
                                                    onClick={() => {
                                                        setMealPlansView({
                                                            type: 'SHOW_MEALPLAN',
                                                            payload: {
                                                                type: 'single',
                                                                id: mealPlans[i].id,
                                                                name: mealPlans[i].name,
                                                                text: mealPlans[i].text,
                                                                options: {
                                                                    diet: mealPlans[i].diet,
                                                                    protein: mealPlans[i].protein,
                                                                    carbs: mealPlans[i].carbs,
                                                                    allergens: mealPlans[i].allergens,
                                                                    fat: mealPlans[i].fat
                                                                }
                                                            }
                                                        })
                                                    }}
                                                >
                                                    View Plan
                                                </button>
                                            </>
                                        }
                                    }
                                }
                                return <span className="spinner-grow spinner-grow-sm mx-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </span>
                            })()
                        }
                        <span
                            tabIndex={0}
                            className='help-tooltip--light'
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="The app chooses a random meal plan for you daily, but you can select another from the list below (The selected plans are tracked in the statistics tab)."
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
                <div className="d-flex flex-wrap gap-3 mt-4">
                    <form className='col-md-9 col-12 d-flex'>
                        <input className="form-control search-input" type="search" placeholder="Search in meal plans" aria-label="Search" />
                        <button className="btn btn-outline-secondary search-button" type="submit">Search</button>
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
                <div className='row g-3 mt-4 mb-4'>
                    {
                        selectedPlansReqStatus === 'success' && mealPlansReqStatus === 'success'
                            ? <>
                                <p className='m-0 ms-1'>Meal Plans: {mealPlans.length}</p>
                                {mealPlans.map(plan =>
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
                                                    <li><b>carbs:</b> {plan.carbs}g</li>
                                                    <li><b>fat:</b> {plan.fat}g</li>
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
                                                            onClick={() => { selectMutation.mutate(plan.id); }}
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
                            : <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                    }
                </div>
                {
                    error !== null && <ErrorModal
                        title={error.title}
                        text={error.text}
                        children={(error.children !== undefined) ? error.children : null}
                    />
                }
            </>
        );
    }

export default SingleMealPlan;
