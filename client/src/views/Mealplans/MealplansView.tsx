/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type FC, useReducer, useState } from 'react';

import mealPlanViewReducer from '../../reducers/mealPlanView';
import type ErrorModalType from '../../types/ErrorModal';

import MainForm from '../../components/MainForm/MainForm';
import Single from '../../components/MealPlans/Single/Single';
import ErrorModal from '../../components/ErrorModal/ErrorModal';

const MealPlansView: FC = () => {
    const [mealPlansView, setMealPlansView] = useReducer(mealPlanViewReducer, { type: 'form' });
    const [error, setError] = useState<ErrorModalType | null>(null)

    return (
        <>
            <div className='container'>
                {
                    (() => {
                        switch (mealPlansView.type) {
                            case 'list':
                            case 'single':
                                return <Single
                                    options={mealPlansView.options!}
                                    name={mealPlansView.name!}
                                    text={mealPlansView.text!}
                                    setMealPlansView={setMealPlansView}
                                />
                            case 'form':
                            default: return <MainForm setMealPlansView={setMealPlansView} setError={setError} />
                        }
                    })()
                }
            </div>
            {
                (error != null) && <ErrorModal title={error.title} text={error.text} >
                    {(error.children !== undefined) ? error.children : null}
                </ErrorModal>
            }
        </>
    );
}

export default MealPlansView;
