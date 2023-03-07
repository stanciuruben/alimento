/* eslint-disable multiline-ternary */
import {
    useState,
    useEffect,
    type FC,
    type ChangeEvent,
    type SetStateAction,
    type Dispatch
} from 'react';
import type OptionsType from '../../types/Options';
import Allergens from '../Allergens/Allergens';

interface Props {
    setShowInput: Dispatch<SetStateAction<boolean>>
    options: OptionsType
    setOptions: Dispatch<SetStateAction<OptionsType>>
}

const MoreOptions: FC<Props> = ({
    setShowInput,
    options,
    setOptions
}) => {
    const [macrosToKcal, setMacrosToKcal] = useState<number>(0);

    useEffect(() => {
        setMacrosToKcal(options.protein * 4 + options.carbs * 4 + options.fat * 9);
    }, [options.protein, options.carbs, options.fat]);

    function changeState (
        e: ChangeEvent<HTMLInputElement>,
        property: string
    ): void {
        let newInput: string = e.target.value;
        if (newInput === '') newInput = '0';
        let newInputAsNumber: number = parseInt(newInput);
        if (isNaN(newInputAsNumber)) {
            // set a warning if input is not a number
            return;
        }
        switch (property) {
            case 'kcal':
                if (newInputAsNumber > 5000) {
                    newInputAsNumber = 5000;
                }
                setOptions({ ...options, kcal: newInputAsNumber });
                break;
            case 'protein':
                if (newInputAsNumber > 400) {
                    newInputAsNumber = 400;
                }
                setOptions({ ...options, protein: newInputAsNumber });
                break;
            case 'carbs':
                if (newInputAsNumber > 600) {
                    newInputAsNumber = 600;
                }
                setOptions({ ...options, carbs: newInputAsNumber });
                break;
            case 'fat':
                if (newInputAsNumber > 300) {
                    newInputAsNumber = 300;
                }
                setOptions({ ...options, fat: newInputAsNumber });
                break;
            default:
        }
    }

    return (
        <div className="form__more_options">
            <Allergens
                setShowInput={setShowInput}
                allergens={options.allergens}
                setAllergens={(allergens: string[]) => { setOptions({ ...options, allergens }); }}
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
                        checked={options.useMacros}
                        onChange={() => {
                            setOptions({ ...options, useMacros: !options.useMacros });
                        }}
                    />
                </span>
            </fieldset>
            {options.useMacros ? (
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
                                inputMode='numeric'
                                name="protein"
                                id="protein"
                                className="form_input--number"
                                value={options.protein}
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
                                inputMode='numeric'
                                name="carbs"
                                id="carbs"
                                className="form_input--number"
                                value={options.carbs}
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
                                inputMode='numeric'
                                name="fat"
                                id="fat"
                                className="form_input--number"
                                value={options.fat}
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
                            inputMode='numeric'
                            name="kcal"
                            id="kcal"
                            value={options.kcal}
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
