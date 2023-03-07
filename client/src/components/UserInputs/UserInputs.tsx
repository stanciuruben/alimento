import {
    type SetStateAction,
    useState,
    type FC,
    type MouseEvent,
    type Dispatch,
    type FormEvent
} from 'react';
import type OptionsType from '../../types/Options';
import MoreOptions from '../MoreOptions/MoreOptions';
import './UserInputs.css';

interface Props {
    setShowInput: Dispatch<SetStateAction<boolean>>
    getMealPlan: (e: FormEvent<HTMLFormElement>) => void
    options: OptionsType
    setOptions: Dispatch<SetStateAction<OptionsType>>
}

const UserInputs: FC<Props> = ({
    setShowInput,
    getMealPlan,
    options,
    setOptions
}) => {
    const [showMore, setShowMore] = useState<boolean>(false);

    function toggleSettings (e: MouseEvent): void {
        e.preventDefault();
        setShowMore(!showMore);
    }

    return (
        <form className="form" onSubmit={getMealPlan}>
            <fieldset className="form__diet form__primary">
                <label htmlFor="diet" className="form__diet__label">
                    Select a diet:
                </label>
                <select
                    name="diet"
                    id="diet"
                    className="btn--1 select_reset"
                    value={options.diet}
                    onChange={(e) => {
                        setOptions({ ...options, diet: e.target.value });
                    }}
                >
                    <option className="btn--1 select_reset" value="none">
                        none
                    </option>
                    <option className="btn--1 select_reset" value="flexitarian">
                        Flexitarian
                    </option>
                    <option className="btn--1 select_reset" value="keto">
                        Keto
                    </option>
                    <option
                        className="btn--1 select_reset"
                        value="mediterranean"
                    >
                        Mediterranean
                    </option>
                    <option className="btn--1 select_reset" value="paleo">
                        Paleo
                    </option>
                    <option className="btn--1 select_reset" value="pescatarian">
                        Pescatarian
                    </option>
                    <option className="btn--1 select_reset" value="raw vegan">
                        Raw Vegan
                    </option>
                    <option className="btn--1 select_reset" value="vegan">
                        Vegan
                    </option>
                    <option className="btn--1 select_reset" value="vegetarian">
                        Vegetarian
                    </option>
                    <option className="btn--1 select_reset" value="whole 30">
                        Whole 30
                    </option>
                </select>
            </fieldset>
            <button
                type="button"
                onClick={toggleSettings}
                className={
                    showMore
                        ? 'btn--1 btn--1--active form__primary'
                        : 'btn--1 form__primary'
                }
                title="More/Less Options"
            >
                <img src="./settings.svg" alt="settings icon" />
            </button>
            <button className="cta--1 form__primary--last" id='form_submit--1' >
                Get Custom Mealplan!
            </button>
            <p className="form__more_options__row form_label--1">
                Options =&nbsp;
                {options.allergens.length > 0 &&
                    'allergens: ' + options.allergens.join(', ') + '. '}
                {options.useMacros
                    ? 'macros: ' +
                    options.protein.toString() +
                    'g protein, ' +
                    options.carbs.toString() +
                    'g carbs, ' +
                    options.fat.toString() +
                    'g fat.'
                    : 'kcal: ' + options.kcal.toString()}
            </p>
            {showMore && (
                <>
                    <div aria-hidden className="form__more_options__bg"></div>
                    <MoreOptions
                        setShowInput={setShowInput}
                        options={options}
                        setOptions={setOptions}
                    />
                </>
            )}
            <button className="cta--1" id='form_submit--2' >
                Get Custom Mealplan!
            </button>
        </form>
    );
};

export default UserInputs;
