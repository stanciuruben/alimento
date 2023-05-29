/* eslint-disable @typescript-eslint/no-misused-promises */
import { type FC, useState, type Dispatch } from 'react';

import type MealPlanViewAction from '../../../../types/MealPlanViewAction';
import MealPlan from '../../../../lib/requests/MealPlan';

const RenameModal: FC<{
    name: string
    setMealPlansView: Dispatch<MealPlanViewAction>
}> = ({
    name,
    setMealPlansView
}) => {
        const [nameInput, setNameInput] = useState<string>(name);

        const onSubmit = async (): Promise<void> => {
            const res = await new MealPlan().update(nameInput);
            setMealPlansView({ type: 'CHANGE_NAME', payload: { name: res.name } });
        }

        return (
            <div
                className="modal fade"
                id="renameModal"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-labelledby="renameLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="renameLabel">
                                Rename Plan
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input
                                value={nameInput}
                                onChange={(e) => { setNameInput(e.target.value); }}
                                type="text"
                                name="allergens"
                                id="allergens-input"
                                className='form-control'
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onSubmit} >Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

export default RenameModal;
