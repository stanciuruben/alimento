import {
    useEffect,
    type FC, useMemo,
    type Dispatch,
    type SetStateAction
} from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik } from 'formik';
import './MainForm.css';

import mainFormSchema from '../../lib/schemas/mainFormSchema';
import MealPlanRequest from '../../lib/requests/MealPlan';
import type ErrorModal from '../../types/ErrorModal';
import type MealPlanViewAction from '../../types/MealPlanViewAction';
import urls from '../../lib/urls.json'

import AllergensModal from './AllergensModal/AllergensModal';
import LoadingModal from './LoadingModal/LoadingModal';

const MainForm: FC<{
    setMealPlansView: Dispatch<MealPlanViewAction>
    setError: Dispatch<SetStateAction<ErrorModal | null>>
}> = ({
    setMealPlansView,
    setError
}) => {
        const queryClient = useQueryClient();

        const addTooltips = (): void => {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                // @ts-expect-error bootstrap
                return new bootstrap.Tooltip(tooltipTriggerEl)
            });
        }

        const MealPlanRequestHandler = useMemo(() => new MealPlanRequest(), [])
        const createMealplanMutation = useMutation({
            mutationFn: MealPlanRequestHandler.create,
            onError: (err: any): void => {
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
                if (err.response?.status !== undefined && err.response.status === 403) {
                    setError({
                        title: 'No funds',
                        text: 'Your account balance is 0!',
                        children: <>
                            <button
                                type='button'
                                onClick={() => { setError(null); }}
                                className='btn me-3'>
                                Close
                            </button>
                            <button type='button' className='btn btn-secondary' >Buy Tokens</button>
                        </>
                    });
                    return;
                }
                setError({
                    title: 'Something went wrong',
                    text: err.message,
                    children: <button
                        type='button'
                        onClick={() => { setError(null); }}
                        className='btn btn-secondary'>
                        Close
                    </button>
                })
            },
            onSuccess: async (data, variables): Promise<void> => {
                await queryClient.invalidateQueries({ queryKey: ['selected'] });
                setMealPlansView({
                    type: 'SHOW_MEALPLAN',
                    payload: {
                        type: 'single',
                        name: 'unnamed',
                        id: data.id,
                        options: {
                            diet: variables.diet,
                            allergens: variables.allergens,
                            protein: data.protein,
                            carbs: data.carbs,
                            fat: data.fat
                        },
                        text: data.mealPlan
                    }
                });
            }
        });

        const onKeyDown = (keyEvent: any): void => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
                keyEvent.preventDefault();
            }
        }

        useEffect(() => {
            addTooltips();
        }, []);

        return (
            <>
                <Formik
                    initialValues={{
                        diet: 'none',
                        allergens: [],
                        useMacros: false,
                        protein: 140,
                        carbs: 250,
                        fat: 50,
                        kcal: 2000
                    }}
                    validationSchema={mainFormSchema}
                    onSubmit={async (values) => {
                        createMealplanMutation.mutate(values);
                    }}
                >
                    {({ isSubmitting, handleSubmit, values, setValues, handleChange }) => (
                        <form className='my-5' onSubmit={handleSubmit} onKeyDown={onKeyDown}>
                            <h1 className='display-6 text-center'>
                                Select your preferences
                            </h1>
                            <fieldset className='mt-5 d-flex justify-content-between align-items-center'>
                                <label htmlFor="diet" className='form-label form-select-label me-3'>
                                    Select a diet:
                                </label>
                                <select
                                    name="diet"
                                    id="diet"
                                    className="form-select"
                                    onChange={handleChange}
                                >
                                    <option value="none">
                                        No specific diet
                                    </option>
                                    <option value="flexitarian">
                                        Flexitarian
                                    </option>
                                    <option value="keto">
                                        Keto
                                    </option>
                                    <option
                                        value="mediterranean"
                                    >
                                        Mediterranean
                                    </option>
                                    <option value="paleo">
                                        Paleo
                                    </option>
                                    <option value="pescatarian">
                                        Pescatarian
                                    </option>
                                    <option value="raw vegan">
                                        Raw Vegan
                                    </option>
                                    <option value="vegan">
                                        Vegan
                                    </option>
                                    <option value="vegetarian">
                                        Vegetarian
                                    </option>
                                    <option value="whole 30">
                                        Whole 30
                                    </option>
                                </select>
                            </fieldset>
                            <fieldset className='form-list__container mt-5 d-flex justify-content-between align-items-start'>
                                <ul className='form-list' >
                                    <div className='d-flex justify-content-between align-items-center flex-nowrap'>
                                        <label htmlFor="allergens" className='form-label me-3 mb-0'>
                                            Allergens:
                                        </label>
                                        <button
                                            className="btn btn-danger form-list-button text-nowrap"
                                            type='button'
                                            data-bs-toggle="modal"
                                            data-bs-target="#allergensModal"
                                        >
                                            Add +
                                        </button>
                                    </div>
                                    {values.allergens.map((item: string, index: number) => (
                                        <li
                                            key={'allergen-' + index.toString() + '-' + item}
                                            className='form-list__item'
                                        >
                                            <span>{item}</span>
                                            <button
                                                type='button'
                                                aria-label="Delete"
                                                className='btn btn-outline-danger form-list__item__delete'
                                                onClick={(e) => {
                                                    setValues({
                                                        ...values,
                                                        allergens: values.allergens.slice(0, index).concat(values.allergens.slice(index + 1))
                                                    });
                                                }}
                                            >
                                                X
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div
                                    tabIndex={0}
                                    className='help-tooltip'
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    title="The items added in this list won't be included in the meal plan."
                                >
                                    ?
                                </div>
                            </fieldset>
                            <fieldset className='mt-5 d-flex justify-content-between'>
                                <div className="form-check form-switch">
                                    <label htmlFor="useMacros" className='form-check-label'>
                                        Kilocalories / Macronutrients
                                    </label>
                                    <input
                                        type="checkbox"
                                        name="useMacros"
                                        id="useMacros"
                                        className="form-check-input me-3"
                                        checked={values.useMacros}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setTimeout(addTooltips, 300);
                                        }}
                                    />
                                </div>
                                <div
                                    tabIndex={0}
                                    className='help-tooltip'
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="left"
                                    title="Switch between kilocalories and macronutrients based plan."
                                >
                                    ?
                                </div>
                            </fieldset>
                            {
                                values.useMacros
                                    ? <fieldset className='mt-5'>
                                        <div>
                                            <div className='d-flex align-items-center'>
                                                <label htmlFor="protein" className='form-label mb-0 me-3'>
                                                    Protein
                                                </label>
                                                <div tabIndex={0} className='help-tooltip' data-bs-toggle="tooltip" data-bs-placement="right" title="1g of protein ≈ 4 kcal">
                                                    ?
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <input
                                                    type="range"
                                                    className="form-range"
                                                    min="0"
                                                    max="400"
                                                    id="protein"
                                                    value={values.protein}
                                                    onChange={handleChange}
                                                />
                                                <span className='form-range-label'>{values.protein} g</span>
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            <div className='d-flex align-items-center'>
                                                <label htmlFor="carbs" className="form-label mb-0 me-3">
                                                    Carbohidrates
                                                </label>
                                                <div
                                                    tabIndex={0}
                                                    className='help-tooltip'
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="right"
                                                    title="1g of carbs ≈ 4 kcal"
                                                >
                                                    ?
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <input
                                                    type="range"
                                                    className="form-range"
                                                    min="0"
                                                    max="500"
                                                    id="carbs"
                                                    value={values.carbs}
                                                    onChange={handleChange}
                                                />
                                                <span className='form-range-label'>{values.carbs} g</span>
                                            </div>
                                        </div>
                                        <div className='mt-3'>
                                            <div className='d-flex align-items-center'>
                                                <label htmlFor="fat" className="form-label mb-0 me-3">
                                                    Fat
                                                </label>
                                                <div
                                                    tabIndex={0}
                                                    className='help-tooltip'
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="right"
                                                    title="1g of fat ≈ 9 kcal"
                                                >
                                                    ?
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <input
                                                    type="range"
                                                    className="form-range"
                                                    min="0"
                                                    max="400"
                                                    id="fat"
                                                    value={values.fat}
                                                    onChange={handleChange}
                                                />
                                                <span className='form-range-label'>{values.fat} g</span>
                                            </div>
                                        </div>
                                        <div className='text-center mt-3'>
                                            <small>
                                                Estimated number of kilocalories for current macros: {values.protein * 4 + values.carbs * 4 + values.fat * 9}
                                            </small>
                                        </div>
                                    </fieldset>
                                    : <fieldset className='mt-5'>
                                        <div>
                                            <div className='d-flex align-items-center'>
                                                <label htmlFor="kcal" className='form-label mb-0 me-3'>
                                                    Kilocalories:
                                                </label>
                                                <div
                                                    tabIndex={0}
                                                    className='help-tooltip'
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="right"
                                                    title="2000 ≈ Average daily kcal intake for an adult"
                                                >
                                                    ?
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <input
                                                    type="range"
                                                    className="form-range"
                                                    min="1000"
                                                    max="5000"
                                                    id="kcal"
                                                    value={values.kcal}
                                                    onChange={handleChange}
                                                />
                                                <span className='form-range-label'>{values.kcal}</span>
                                            </div>
                                        </div>
                                    </fieldset>
                            }

                            <div className="row mt-5 mx-1 mx-sm-0">
                                <button
                                    className="col me-3 btn btn-lg btn-secondary"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => {
                                        setMealPlansView({ type: 'CHANGE_VIEW', payload: 'list' })
                                    }}
                                >
                                    Back to list
                                </button>
                                <button
                                    className="col btn btn-lg btn-primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Generate
                                </button>
                            </div>
                            <AllergensModal
                                allergens={values.allergens}
                                setAllergens={(allergens: string[]) => {
                                    setValues({ ...values, allergens: values.allergens.concat(allergens as unknown as never) })
                                }}
                            />
                        </form>
                    )}
                </Formik>
                {createMealplanMutation.isLoading && <LoadingModal />}
            </>
        );
    }

export default MainForm;
