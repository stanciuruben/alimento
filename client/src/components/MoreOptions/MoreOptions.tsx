/* eslint-disable multiline-ternary */
import { type FC, useState, type ChangeEvent } from 'react';
// import './MoreOptions.css';

interface Props {}

const MoreOptions: FC<Props> = () => {
    const [useMacros, setUseMacros] = useState<boolean>(false);
    const [kcal, setKcal] = useState<number>(2000);

    function changeKcal (e: ChangeEvent<HTMLInputElement>): void {
        setKcal(parseInt(e.target.value));
    }

    return (
        <div className="form__more_options">
            <fieldset className="form__more_options__row">
                <label htmlFor="kcal-macros" className="form_label">
                    Use kilocalories/macronutrients:
                </label>
                <input
                    type="checkbox"
                    name="kcal-macros"
                    id="kcal-macros"
                    className="form_checkbox"
                    onChange={() => {
                        setUseMacros(!useMacros);
                    }}
                />
            </fieldset>
            {useMacros ? (
                <fieldset className="form__more_options__row">
                    <div className="form__more_options__row--1">
                        <label htmlFor="protein" className="form_label">
                            Proteins:
                        </label>
                        <input
                            type="text"
                            name="protein"
                            id="protein"
                            className="form_input--number"
                        />
                        g
                    </div>
                    <div className="form__more_options__row--1" >
                        <label htmlFor="carbs" className="form_label">
                            Carbohidrates:
                        </label>
                        <input
                            type="text"
                            name="carbs"
                            id="carbs"
                            className="form_input--number"
                        />
                        g
                    </div>
                    <div className="form__more_options__row--1" >
                        <label htmlFor="fat" className="form_label">
                            Fats:
                        </label>
                        <input
                            type="text"
                            name="fat"
                            id="fat"
                            className="form_input--number"
                        />
                        g
                    </div>
                </fieldset>
            ) : (
                <fieldset className="form__more_options__row">
                    <label htmlFor="kcal" className="form_label">
                        Kilocalories:
                    </label>
                    <input
                        type="text"
                        name="kcal"
                        id="kcal"
                        value={kcal}
                        onChange={changeKcal}
                        className="form_input--number"
                    />
                </fieldset>
            )}
        </div>
    );
};

export default MoreOptions;
