/* eslint-disable multiline-ternary */
import { useState, type FC } from 'react';

interface Props {}

const UserInputs: FC<Props> = () => {
    const [useMacros, setUseMacros] = useState<boolean>(false);
    return (
        <form>
            <fieldset>
                <label htmlFor="diet">Choose Diet</label>
                <select name="diet" id="">
                    <option value="flexitarian">Flexitarian</option>
                    <option value="keto">Keto</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="paleo">Paleo</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="raw vegan">Raw Vegan</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="whole 30">Whole 30</option>
                </select>
            </fieldset>
            <fieldset>
                <h2>Use Macros?</h2>
                <input type="checkbox" name="kcal-macros" id="kcal-macros" onChange={() => { setUseMacros(!useMacros) }} />
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
            <button>Get Custom Mealplan!</button>
        </form>
    );
};

export default UserInputs;
