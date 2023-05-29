import { useRef, type FC } from 'react';

const AllergensModal: FC<{
    allergens: string[]
    setAllergens: (allergens: string[]) => void
}> = ({
    allergens,
    setAllergens
}) => {
        const allergensInput = useRef<HTMLInputElement>(null);

        const addAllergens = (): void => {
            if (allergensInput.current != null) {
                const itemsToAdd: string[] = allergensInput.current?.value.split(/\s*,\s*|\s+/) ?? [];
                allergensInput.current.value = '';
                const filteredItems = itemsToAdd.filter(item => !allergens.includes(item));
                while (filteredItems[filteredItems.length - 1] === '') {
                    filteredItems.pop();
                }
                setAllergens(filteredItems);
            }
        }

        return (
            <div
                className="modal fade"
                id="allergensModal"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-labelledby="allergensModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="allergensModalLabel">
                                Allergens
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>
                                Insert one or more ingredients separated by
                                commas or spaces, that shouldn't be included in
                                your meal plan!
                            </p>
                            <input ref={allergensInput} type="text" name="allergens" id="allergens-input" className='form-control' />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addAllergens}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

export default AllergensModal;
