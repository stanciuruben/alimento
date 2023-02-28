/* eslint-disable multiline-ternary */
import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
    type MouseEvent
} from 'react';
import type MoreOptionsType from './types/MoreOptions';
import UserInputs from './components/UserInputs/UserInputs';
import './App.css';
import Loader from './components/Loader/Loader';
import UserProfile from './components/UserProfile/UserProfile';

function App (): JSX.Element {
    const allergensInput = useRef<HTMLInputElement>(null);
    const resContainer = useRef<HTMLPreElement>(null);
    const fillAll = useRef<boolean>(false);
    const ctaSection = useRef<HTMLDivElement>(null);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [showUser, setShowUser] = useState<boolean>(false);
    const [diet, setDiet] = useState<string>('none');
    const [allergens, setAllergens] = useState<string[]>([]);
    const [moreOptions, setMoreOptions] = useState<MoreOptionsType>({
        kcal: 2000,
        protein: 115,
        carbs: 250,
        fat: 60,
        useMacros: false
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mealPlan, setMealPlan] = useState<string>('');

    function fillResponse (i: number): void {
        if (i === mealPlan.length) {
            if (ctaSection.current !== null) {
                ctaSection.current.style.display = 'block';
            }
            return;
        }
        if (fillAll.current && resContainer.current !== null && ctaSection.current !== null) {
            resContainer.current.innerText = mealPlan;
            ctaSection.current.style.display = 'block';
            return;
        }
        if (resContainer.current !== null) {
            if (resContainer.current.innerText.length === mealPlan.length) return;
            resContainer.current.innerText = resContainer.current.innerText + mealPlan[i];
            setTimeout(() => { fillResponse(i + 1); }, 50);
        }
    }

    useEffect(() => {
        fillAll.current = false;
        fillResponse(0);
    }, [mealPlan]);

    function addAllergens (e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        const itemsToAdd: string[] =
            allergensInput.current?.value.split(/\s*,\s*|\s+/) ?? [];
        while (itemsToAdd[itemsToAdd.length - 1] === '') {
            itemsToAdd.pop();
        }
        setAllergens(allergens.concat(itemsToAdd));
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

    function ltrim (str: string): string {
        if (str.length === 0) return str;
        return str.replace(/^\s+/g, '');
    }

    function getMealPlan (e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        setIsLoading(true);
        const body = { ...moreOptions, allergens, diet };
        fetch('http://localhost:9999/mealplan', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(async (res) => await res.json())
            .then((data) => {
                setIsLoading(false);
                if (data.message !== undefined) {
                    console.error(data);
                    setMealPlan(data.message);
                    return;
                }
                setMealPlan(ltrim(data));
            })
            .catch((err) => {
                console.error(err.message);
            });
    }

    if (isLoading) {
        return (
            <Loader />
        );
    }

    if (mealPlan === '') {
        return (
            <main id="app_container">
                <h1 id="watermark">alimento</h1>
                <UserInputs
                    setShowInput={setShowInput}
                    allergens={allergens}
                    setAllergens={setAllergens}
                    setMoreOptions={setMoreOptions}
                    moreOptions={moreOptions}
                    getMealPlan={getMealPlan}
                    diet={diet}
                    setDiet={setDiet}
                />
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
                <button id='user__toggler' onClick={() => { setShowUser(!showUser) }}>
                    <img src="/account.svg" alt="profile icon" />
                </button>
                {
                    showUser && <UserProfile />
                }
            </main>
        );
    }

    return (
        <main id="app_container" onClick={() => { fillAll.current = true }}>
            <h1 id="watermark">alimento</h1>
            <article className="res_container">
                <div>
                    <h2 className="res_container__title">
                        Meal plan successfully generated!
                    </h2>
                    {moreOptions.useMacros ? (
                        <dl className="res_container__macros">
                            <dt>Options</dt>
                            <dd>Diet Type: {diet.slice(0, 1).toUpperCase() + diet.slice(1)}</dd>
                            <dd>Protein: {moreOptions.protein}g</dd>
                            <dd>Carbs: {moreOptions.carbs}g</dd>
                            <dd>Fat: {moreOptions.fat}g</dd>
                            <dd>
                                Kilocalories:{' '}
                                {moreOptions.protein * 4 +
                                    moreOptions.carbs * 4 +
                                    moreOptions.fat * 9}
                            </dd>
                            {allergens.length > 0 && <dd>Without: {allergens.join(', ')}</dd>}
                        </dl>
                    ) : (
                        <dl className="res_container__macros">
                            <dt>Options</dt>
                            <dd>Diet Type: {diet}</dd>
                            <dd>Kilocalories: {moreOptions.kcal}</dd>
                            {allergens.length > 0 && <dd>Without: {allergens.join(', ')}</dd>}
                        </dl>
                    )}
                </div>
                <pre className="res_container__meal_plan" ref={resContainer} ></pre>
                <div className="res_container__meal_plan__cta_section" ref={ctaSection} >
                    <button
                        className="cta--1"
                        onClick={() => {
                            setMealPlan('');
                        }}
                    >
                        Go Back
                    </button>
                </div>
            </article>
            <button id='user__toggler' onClick={() => { setShowUser(!showUser) }}>
                <img src="/account.svg" alt="profile icon" />
            </button>
            {
                showUser && <UserProfile />
            }
        </main>
    );
}

export default App;
