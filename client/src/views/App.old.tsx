/* eslint-disable multiline-ternary */
import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
    type MouseEvent
} from 'react';
import type OptionsType from './types/Options';
import UserInputs from './components/UserInputs/UserInputs';
import './App.css';
import Loader from './components/Loader/Loader';
import UserProfile from './components/UserProfile/UserProfile';
import MealPlans from './components/MealPlans/MealPlans';
import { useMutation, useQueryClient } from 'react-query';
import postMealPlan from './lib/postMealPlan';
import fetchOneMealPlan from './lib/fetchOneMealPlan';

interface MealPlan extends OptionsType {
    text: string
}

function App (): JSX.Element {
    const allergensInput = useRef<HTMLInputElement>(null);
    const resContainer = useRef<HTMLPreElement>(null);
    const fillAll = useRef<boolean>(false);
    const ctaSection = useRef<HTMLDivElement>(null);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [showUserData, setShowUserData] = useState<boolean>(false);
    const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
    const [options, setOptions] = useState<OptionsType>({
        diet: 'none',
        allergens: [],
        kcal: 2000,
        protein: 115,
        carbs: 250,
        fat: 60,
        useMacros: false
    });
    const queryClient = useQueryClient();
    const postMealPlanMutation = useMutation({
        mutationFn: postMealPlan,
        onError: (error) => {
            console.error(error);
        },
        onSuccess: async (data) => {
            if (data.message !== undefined) {
                console.error(data.message);
                return;
            }
            await queryClient.invalidateQueries(['users', 'mealplans']);
            setCurrentMealPlan({ ...options, text: data });
        }
    })

    const getMealPlanMutation = useMutation({
        mutationFn: fetchOneMealPlan,
        onError: (error) => {
            console.error(error);
        },
        onSuccess: (data) => {
            if (data.message !== undefined) {
                console.error(data.message);
                return;
            }
            setCurrentMealPlan({
                text: data.text,
                diet: data.diet,
                allergens: data.allergens.length > 0 ? data.allergens.split(', ') : [],
                kcal: data.kcal,
                protein: data.protein,
                carbs: data.carbs,
                fat: data.fat,
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                useMacros: !!data.useMacros
            });
        }
    })

    useEffect(() => {
        if (currentMealPlan !== null) {
            fillAll.current = false;
            fillResponse(0, currentMealPlan.text);
        }
    }, [currentMealPlan]);

    function fillResponse (i: number, data: string): void {
        if (i === data.length) {
            if (ctaSection.current !== null) {
                ctaSection.current.style.display = 'block';
            }
            return;
        }
        if (fillAll.current && resContainer.current !== null && ctaSection.current !== null) {
            resContainer.current.innerText = data;
            ctaSection.current.style.display = 'block';
            return;
        }
        if (resContainer.current !== null) {
            if (resContainer.current.innerText.length === data.length) return;
            resContainer.current.innerText = resContainer.current.innerText + data[i];
            setTimeout(() => { fillResponse(i + 1, data); }, 50);
        }
    }

    function addAllergens (e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        const itemsToAdd: string[] =
            allergensInput.current?.value.split(/\s*,\s*|\s+/) ?? [];
        while (itemsToAdd[itemsToAdd.length - 1] === '') {
            itemsToAdd.pop();
        }
        setOptions({ ...options, allergens: options.allergens.concat(itemsToAdd) });
        setShowInput(false);
    }

    function closeInput (e: MouseEvent): void {
        setShowInput(false);
    }

    function closeInputOnKeyStroke (e: KeyboardEvent): void {
        if (e.key === 'Escape') {
            setShowInput(false);
        }
    }

    function handleFormSubmit (e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        postMealPlanMutation.mutate(options);
    }

    if (postMealPlanMutation.isLoading || getMealPlanMutation.isLoading) {
        return (
            <Loader />
        );
    }

    if (currentMealPlan !== null) {
        return (
            <main id="app_container" onClick={() => { fillAll.current = true }}>
                <h1 id="watermark">alimento</h1>
                <article className="res_container">
                    <div>
                        <h2 className="res_container__title">
                            Enjoy your plan!
                        </h2>
                        {currentMealPlan.useMacros ? (
                            <dl className="res_container__macros">
                                <dt>Options</dt>
                                <dd>Diet Type: {currentMealPlan.diet.slice(0, 1).toUpperCase() + currentMealPlan.diet.slice(1)}</dd>
                                <dd>Protein: {currentMealPlan.protein}g</dd>
                                <dd>Carbs: {currentMealPlan.carbs}g</dd>
                                <dd>Fat: {currentMealPlan.fat}g</dd>
                                <dd>
                                    Kilocalories:{' '}
                                    {currentMealPlan.protein * 4 +
                                        currentMealPlan.carbs * 4 +
                                        currentMealPlan.fat * 9}
                                </dd>
                                {currentMealPlan.allergens.length > 0 && <dd>Without: {currentMealPlan.allergens.join(', ')}</dd>}
                            </dl>
                        ) : (
                            <dl className="res_container__macros">
                                <dt>Options</dt>
                                <dd>Diet Type: {currentMealPlan.diet}</dd>
                                <dd>Kilocalories: {currentMealPlan.kcal}</dd>
                                {currentMealPlan.allergens.length > 0 && <dd>Without: {currentMealPlan.allergens.join(', ')}</dd>}
                            </dl>
                        )}
                    </div>
                    <pre className="res_container__meal_plan" ref={resContainer} ></pre>
                    <div className="res_container__meal_plan__cta_section" ref={ctaSection} >
                        <button
                            className="cta--1"
                            onClick={() => {
                                setCurrentMealPlan(null);
                            }}
                        >
                            Go Back
                        </button>
                    </div>
                </article>
                <button id='user__toggler' onClick={() => { setShowUserData(!showUserData) }}>
                    <img src="./account.svg" alt="profile icon" />
                </button>
                <UserProfile showUserData={showUserData} />
            </main>
        );
    }

    return (
        <main id="app_container">
            <h1 id="watermark">alimento</h1>
            <UserInputs
                setShowInput={setShowInput}
                getMealPlan={handleFormSubmit}
                options={options}
                setOptions={setOptions}
            />
            <MealPlans getOneMealPlan={getMealPlanMutation.mutate} />
            {showInput && (
                <>
                    <button
                        className="allergens__input__overlay"
                        onClick={closeInput}
                    ></button>
                    <form
                        className="allergens__input"
                        onSubmit={addAllergens}
                        onKeyDown={closeInputOnKeyStroke}
                    >
                        <label
                            htmlFor="allergens-input"
                            className="allergens__input__label"
                        >
                            Insert one or more ingredients separated by
                            commas or spaces, that shouldn't be included in
                            your meal plan.
                        </label>
                        <input
                            autoFocus
                            ref={allergensInput}
                            type="text"
                            name="allergens-input"
                            className="allergens__input__input"
                        />
                        <button
                            className="allergens__input__submit btn--1"
                            type="submit"
                        >
                            Add
                        </button>
                    </form>
                </>
            )}
            <button id='user__toggler' onClick={() => { setShowUserData(!showUserData) }}>
                <img src="./account.svg" alt="profile icon" />
            </button>
            <UserProfile showUserData={showUserData} />
        </main>
    );
}

export default App;
