import { type FC, type Dispatch } from 'react';

import type Options from '../../../types/Options';
import type MealPlanViewAction from '../../../types/MealPlanViewAction';
import capitalizeString from '../../../lib/utils/capitalizeString';

import RenameModal from './RenameModal/RenameModal';

const SingleMealPlan: FC<{
    options: Options
    name: string
    text: string
    setMealPlansView: Dispatch<MealPlanViewAction>
}> = ({
    options,
    name,
    text,
    setMealPlansView
}) => {
        return (
            <div className="container">
                <hgroup className='text-center my-5'>
                    <h1 className='d-inline-block align-middle m-0 me-3'>
                        {capitalizeString(name)}
                    </h1>
                    <button
                        type='button'
                        className='btn btn-light d-inline-block align-middle m-0'
                        tabIndex={0}
                        data-bs-toggle="modal"
                        data-bs-target="#renameModal"
                        title='Rename Plan'
                    >
                        <i className="bi bi-pencil-fill"></i>
                    </button>
                </hgroup>
                <div className="d-flex my-5">
                    <button
                        className='col btn btn-secondary me-3'
                        type='button'
                        onClick={() => { setMealPlansView({ type: 'CHANGE_VIEW', payload: 'list' }); }}
                    >
                        Back To List
                    </button>
                    <button
                        className='col btn btn-primary'
                        type='button'
                        onClick={() => { setMealPlansView({ type: 'CHANGE_VIEW', payload: 'form' }); }}
                    >
                        Generate Another
                    </button>
                </div>
                <div className='my-5'>
                    <h3 className='mb-3'>
                        Details
                    </h3>
                    {
                        <ul className='list-group'>
                            <li className='list-group-item' ><b>Diet:</b> {capitalizeString(options.diet)}</li>
                            <li className='list-group-item' ><b>Allergens:</b> {options.allergens.length > 0 ? options.allergens.join(', ') + '.' : '(none)'}</li>
                            <li className='list-group-item' ><b>Protein:</b> {options.protein}</li>
                            <li className='list-group-item' ><b>Carbs:</b> {options.carbs}</li>
                            <li className='list-group-item' ><b>Fat:</b> {options.fat}</li>
                            <li className='list-group-item' ><b>Kcal:</b> {options.fat * 9 + (options.protein + options.carbs) * 4}</li>
                        </ul>
                    }
                </div>
                <div className='my-5' >
                    <h3 className='mb-3'>
                        Meal Plan
                    </h3>
                    <p>
                        {
                            text.split('\n').map((line, idx) => {
                                return (
                                    <>
                                        <span key={'line-' + idx.toString()}>
                                            {line}
                                        </span>
                                        <br />
                                    </>
                                )
                            })
                        }
                    </p>
                </div>
                <RenameModal name={name} setMealPlansView={setMealPlansView} />
            </div>
        );
    }

export default SingleMealPlan;
