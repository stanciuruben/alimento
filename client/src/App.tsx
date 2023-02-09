import {
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
    type MouseEvent
} from 'react';
import type MoreOptionsType from './types/MoreOptions';
import UserInputs from './components/UserInputs/UserInputs';
import './App.css';

function App (): JSX.Element {
    const allergensInput = useRef<HTMLInputElement>(null);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [diet, setDiet] = useState<string>('none');
    const [allergens, setAllergens] = useState<string[]>([]);
    const [moreOptions, setMoreOptions] = useState<MoreOptionsType>({
        kcal: 2000,
        protein: 115,
        carbs: 250,
        fat: 60,
        useMacros: false
    });

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

    function getMealPlan (e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        const body = { ...moreOptions, allergens, diet };
        fetch('http://localhost:9999/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then(async (res) => await res.json())
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.error(err.message);
            });
    }

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
                            Insert one or more ingredients separated by commas
                            or spaces, that shouldn't be included in your meal
                            plan.
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
        </main>
    );
}

export default App;
