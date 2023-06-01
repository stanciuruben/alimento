/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type FC, useReducer, useState } from 'react';

import mealPlanViewReducer from '../../reducers/mealPlanView';
import type ErrorModalType from '../../types/ErrorModal';
import type MealPlan from '../../types/MealPlan';

import MainForm from '../../components/MainForm/MainForm';
import Single from '../../components/MealPlans/Single/Single';
import ErrorModal from '../../components/ErrorModal/ErrorModal';
import List from '../../components/MealPlans/List/List';

const MealPlansView: FC<{
    mealPlans: MealPlan[]
    mealPlansReqStatus: 'error' | 'idle' | 'loading' | 'success'
    selectedPlans: Array<{ plan_id: number, date: string }>
    selectedPlansReqStatus: 'error' | 'idle' | 'loading' | 'success'
}> = ({
    mealPlans,
    mealPlansReqStatus,
    selectedPlans,
    selectedPlansReqStatus
}) => {
        const [mealPlansView, setMealPlansView] = useReducer(mealPlanViewReducer, { type: 'list' });
        const [error, setError] = useState<ErrorModalType | null>(null);

        return (
            <>
                <div className='container'>
                    {
                        (() => {
                            switch (mealPlansView.type) {
                                case 'list':
                                    return <List
                                        mealPlans={mealPlans}
                                        mealPlansReqStatus={mealPlansReqStatus}
                                        setMealPlansView={setMealPlansView}
                                        selectedPlans={selectedPlans}
                                        selectedPlansReqStatus={selectedPlansReqStatus}
                                    />
                                case 'single':
                                    return <Single
                                        id={mealPlansView.id!}
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
