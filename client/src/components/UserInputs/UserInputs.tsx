import {
    type SetStateAction,
    useState,
    type FC,
    type MouseEvent,
    type Dispatch
} from 'react';
import type MoreOptionsType from '../../types/MoreOptions';
import MoreOptions from '../MoreOptions/MoreOptions';
import './UserInputs.css';

interface Props {
    setShowInput: Dispatch<SetStateAction<boolean>>
    allergens: string[]
    setAllergens: Dispatch<SetStateAction<string[]>>
    setMoreOptions: Dispatch<SetStateAction<MoreOptionsType>>
    moreOptions: MoreOptionsType
}

const UserInputs: FC<Props> = ({
    setShowInput,
    allergens,
    setAllergens,
    setMoreOptions,
    moreOptions
}) => {
    const [showMore, setShowMore] = useState<boolean>(false);

    function toggleSettings (e: MouseEvent): void {
        e.preventDefault();
        setShowMore(!showMore);
    }

    return (
        <form className="form">
            <fieldset className="form__diet form__primary">
                <label htmlFor="diet" className="form__diet__label">
                    Select a diet:
                </label>
                <select name="diet" id="diet" className="btn--1 select_reset">
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
                <img src="/settings.svg" alt="settings icon" />
            </button>
            <button className="cta--1 form__primary--last">
                Get Custom Mealplan!
            </button>
            <p className="form__more_options__row form_label--1">
                Options =&nbsp;
                {allergens.length > 0 &&
                    'allergens: ' + allergens.join(', ') + '. '}
                {moreOptions.useMacros
                    ? 'macros: ' +
                      moreOptions.protein.toString() +
                      'g protein, ' +
                      moreOptions.carbs.toString() +
                      'g carbs, ' +
                      moreOptions.fat.toString() +
                      'g fat.'
                    : 'kcal: ' + moreOptions.kcal.toString()}
            </p>
            {showMore && (
                <>
                    <div aria-hidden className="form__more_options__bg"></div>
                    <MoreOptions
                        setShowInput={setShowInput}
                        allergens={allergens}
                        setAllergens={setAllergens}
                        setMoreOptions={setMoreOptions}
                        moreOptions={moreOptions}
                    />
                </>
            )}
        </form>
    );
};

export default UserInputs;
