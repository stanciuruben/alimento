/* eslint-disable multiline-ternary */
import {
    type FC,
    useState,
    type ChangeEvent,
    useEffect,
    type SetStateAction,
    type Dispatch
} from 'react';
import type MoreOptionsType from '../../types/MoreOptions';
import Allergens from '../Allergens/Allergens';

interface Props {
    setShowInput: Dispatch<SetStateAction<boolean>>
    allergens: string[]
    setAllergens: Dispatch<SetStateAction<string[]>>
    setMoreOptions: Dispatch<SetStateAction<MoreOptionsType>>
    moreOptions: MoreOptionsType
}

const MoreOptions: FC<Props> = ({
    setShowInput,
    allergens,
    setAllergens,
    setMoreOptions,
    moreOptions
}) => {
    const [useMacros, setUseMacros] = useState<boolean>(moreOptions.useMacros);
    const [kcal, setKcal] = useState<number>(moreOptions.kcal);
    const [protein, setProtein] = useState<number>(moreOptions.protein);
    const [carbs, setCarbs] = useState<number>(moreOptions.carbs);
    const [fat, setFat] = useState<number>(moreOptions.fat);
    const [macrosToKcal, setMacrosToKcal] = useState<number>(0);

    useEffect(() => {
        setMacrosToKcal(protein * 4 + carbs * 4 + fat * 9);
    }, [protein, carbs, fat]);

    useEffect(() => {
        setMoreOptions({
            kcal,
            protein,
            carbs,
            fat,
            useMacros
        });
    }, [useMacros, kcal, protein, carbs, fat])

    function changeState (
        e: ChangeEvent<HTMLInputElement>,
        property: string
    ): void {
        let newInput: string = e.target.value;
        if (newInput === '') newInput = '0';
        const newInputAsNumber: number = parseInt(newInput);
        if (isNaN(newInputAsNumber)) {
            // set a warning if input is not a number
            return;
        }
        switch (property) {
            case 'kcal':
                setKcal(newInputAsNumber);
                break;
            case 'protein':
                setProtein(newInputAsNumber);
                break;
            case 'carbs':
                setCarbs(newInputAsNumber);
                break;
            case 'fat':
                setFat(newInputAsNumber);
                break;
            default:
        }
    }

    return (
        <div className="form__more_options">
            <Allergens
                setShowInput={setShowInput}
                allergens={allergens}
                setAllergens={setAllergens}
            />
            <fieldset className="form__more_options__row">
                <label htmlFor="kcal-macros" className="form_label">
                    Use kilocalories/macronutrients:
                </label>
                <span className="form__right--1" tabIndex={-1} >
                    <input
                        type="checkbox"
                        name="kcal-macros"
                        id="kcal-macros"
                        className="form_checkbox"
                        tabIndex={0}
                        checked={useMacros}
                        onChange={() => {
                            setUseMacros(!useMacros);
                        }}
                    />
                </span>
            </fieldset>
            {useMacros ? (
                <div className="form__more_options__row">
                    <fieldset className="form__more_options__row--1">
                        <label htmlFor="protein" className="form_label">
                            Protein:
                        </label>
                        <span className="form__right">
                            <span className="form__right__text">
                                1g of protein ≈ 4 kcal
                            </span>
                            <input
                                type="text"
                                name="protein"
                                id="protein"
                                className="form_input--number"
                                value={protein}
                                onChange={(e) => {
                                    changeState(e, 'protein');
                                }}
                            />
                            &nbsp;g
                        </span>
                    </fieldset>
                    <fieldset className="form__more_options__row--1">
                        <label htmlFor="carbs" className="form_label">
                            Carbohidrates:
                        </label>
                        <span className="form__right">
                            <span className="form__right__text">
                                1g of carbs ≈ 4 kcal
                            </span>
                            <input
                                type="text"
                                name="carbs"
                                id="carbs"
                                className="form_input--number"
                                value={carbs}
                                onChange={(e) => {
                                    changeState(e, 'carbs');
                                }}
                            />
                            &nbsp;g
                        </span>
                    </fieldset>
                    <fieldset className="form__more_options__row--1">
                        <label htmlFor="fat" className="form_label">
                            Fats:
                        </label>
                        <span className="form__right">
                            <span className="form__right__text">
                                1g of fats ≈ 9 kcal
                            </span>
                            <input
                                type="text"
                                name="fat"
                                id="fat"
                                className="form_input--number"
                                value={fat}
                                onChange={(e) => {
                                    changeState(e, 'fat');
                                }}
                            />
                            &nbsp;g
                        </span>
                    </fieldset>
                    <small className="form__text--small">
                        Estimated number of kilocalories for current macros:{' '}
                        {macrosToKcal}
                    </small>
                </div>
            ) : (
                <fieldset className="form__more_options__row">
                    <label htmlFor="kcal" className="form_label">
                        Kilocalories:
                    </label>
                    <span className="form__right">
                        <span className="form__right__text">
                            2000 ≈ average daily kcal intake
                        </span>
                        <input
                            type="text"
                            name="kcal"
                            id="kcal"
                            value={kcal}
                            onChange={(e) => {
                                changeState(e, 'kcal');
                            }}
                            className="form_input--number"
                        />
                    </span>
                </fieldset>
            )}
        </div>
    );
};

export default MoreOptions;
