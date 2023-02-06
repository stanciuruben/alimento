/* eslint-disable multiline-ternary */
import { type FC, useState } from 'react';
// import './MoreOptions.css';

interface Props {}

const MoreOptions: FC<Props> = () => {
    const [useMacros, setUseMacros] = useState<boolean>(false);
    return (
        <div className="form__more_options">
            <fieldset>
                <h2>Use Macros?</h2>
                <input
                    type="checkbox"
                    name="kcal-macros"
                    id="kcal-macros"
                    onChange={() => {
                        setUseMacros(!useMacros);
                    }}
                />
            </fieldset>
            {useMacros ? (
                <fieldset>
                    <label htmlFor="protein">Grams of Protein</label>
                    <input type="number" name="protein" id="protein" />
                    <label htmlFor="carbs">Grams of Carbohidrates</label>
                    <input type="number" name="carbs" id="carbs" />
                    <label htmlFor="fat">Grams of Fat</label>
                    <input type="number" name="fat" id="fat" />
                </fieldset>
            ) : (
                <fieldset>
                    <label htmlFor="kcal">Kilocalories</label>
                    <input type="number" name="kcal" id="kcal" />
                </fieldset>
            )}
        </div>
    );
};

export default MoreOptions;
