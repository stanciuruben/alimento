import {
    type SetStateAction,
    type FC,
    type MouseEvent,
    type Dispatch
} from 'react';
import './Allergens.css';

interface Props {
    setShowInput: Dispatch<SetStateAction<boolean>>
    allergens: string[]
    setAllergens: (allergens: string[]) => void
}

const Allergens: FC<Props> = ({ setShowInput, allergens, setAllergens }) => {
    function openInput (e: MouseEvent): void {
        e.preventDefault();
        setShowInput(true);
    }

    function deleteItem (e: MouseEvent, index: number): void {
        e.preventDefault();
        setAllergens(
            allergens.filter((_item: string, i: number) => !(index === i))
        );
    }

    return (
        <>
            <ul className="allergens">
                <label htmlFor="allergens" className="form_label">
                    Allergens:
                </label>
                {allergens.map((item: string, index: number) => (
                    <li
                        key={'allergen-' + index.toString() + '-' + item}
                        className="allergens__item"
                    >
                        {item}
                        <button
                            className="allergens__item__delete"
                            onClick={(e) => {
                                deleteItem(e, index);
                            }}
                        >
                            X
                        </button>
                    </li>
                ))}
                <button
                    name="allergens"
                    className="allergens__item--1"
                    onClick={openInput}
                >
                    Add +
                </button>
            </ul>
        </>
    );
};

export default Allergens;
