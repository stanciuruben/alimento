/* eslint-disable multiline-ternary */
import { type FC, useState, type ChangeEvent, useEffect } from 'react';
// import './MoreOptions.css';

interface Props {}

const MoreOptions: FC<Props> = () => {
    const [useMacros, setUseMacros] = useState<boolean>(false);
    const [kcal, setKcal] = useState<number>(2000);
    const [protein, setProtein] = useState<number>(110);
    const [carbs, setCarbs] = useState<number>(255);
    const [fat, setFat] = useState<number>(60);
    const [macrosToKcal, setMacrosToKcal] = useState<number>(0);

    useEffect(() => {
        setMacrosToKcal(protein * 4 + carbs * 4 + fat * 9);
        // send state to parent
    }, [protein, carbs, fat])

    function changeState (
        e: ChangeEvent<HTMLInputElement>,
        property: string
    ): void {
        const newInput: number = parseInt(e.target.value);
        if (isNaN(newInput)) {
            return;
        }
        switch (property) {
            case 'kcal':
                setKcal(newInput);
                break;
            case 'protein':
                setProtein(newInput);
                break;
            case 'carbs':
                setCarbs(newInput);
                break;
            case 'fat':
                setFat(newInput);
                break;
            default:
        }
    }

    return (
        <div className="form__more_options">
            <fieldset className="form__more_options__row">
                <label htmlFor="kcal-macros" className="form_label">
                    Use kilocalories/macronutrients:
                </label>
                <span className="form__right--1">
                    <input
                        type="checkbox"
                        name="kcal-macros"
                        id="kcal-macros"
                        className="form_checkbox"
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
                        Estimated number of kilocalories for current macros: {macrosToKcal}
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
