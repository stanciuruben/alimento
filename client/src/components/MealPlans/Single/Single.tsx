import { type FC, type Dispatch, useMemo } from 'react';

import type Options from '../../../types/Options';
import type MealPlanViewAction from '../../../types/MealPlanViewAction';
import capitalizeString from '../../../lib/utils/capitalizeString';

import RenameModal from './RenameModal/RenameModal';
import DoughnutChart from '../../Charts/DoughnutChart';

const SingleMealPlan: FC<{
    id: number
    options: Options
    name: string
    text: string
    setMealPlansView: Dispatch<MealPlanViewAction>
}> = ({
    id,
    options,
    name,
    text,
    setMealPlansView
}) => {
        const percetages = useMemo(() => {
            const kcal = options.fat * 9 + (options.protein + options.carbs) * 4;
            return {
                p: (options.protein * 4 / kcal * 100).toPrecision(4),
                c: (options.carbs * 4 / kcal * 100).toPrecision(4),
                f: (options.fat * 9 / kcal * 100).toPrecision(4)
            }
        }, [options]);

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
                <div className='my-5 row'>
                    <div className="col-lg-6">
                        <h3 className='mb-3'>
                            Details
                        </h3>
                        <ul className='list-group'>
                            <li className='list-group-item' ><b>Diet:</b> {capitalizeString(options.diet)}</li>
                            <li className='list-group-item' ><b>Allergens:</b> {options.allergens.length > 0 ? options.allergens.join(', ') + '.' : '(none)'}</li>
                            <li className='list-group-item' ><b>Protein:</b> {options.protein}</li>
                            <li className='list-group-item' ><b>Carbs:</b> {options.carbs}</li>
                            <li className='list-group-item' ><b>Fat:</b> {options.fat}</li>
                            <li className='list-group-item' ><b>Kcal:</b> {options.fat * 9 + (options.protein + options.carbs) * 4}</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 my-3">
                        <DoughnutChart
                            timeSpan={0}
                            title='Macros to Kcal Ratio'
                            id='macros-to-kcal-ratio'
                            chartData={{
                                labels: ['Protein', 'Carbohidrates', 'Fat'],
                                datasets: [
                                    {
                                        label: 'Macros To Kcal in Percentage',
                                        data: [
                                            parseFloat(percetages.p),
                                            parseFloat(percetages.c),
                                            parseFloat(percetages.f)
                                        ]
                                    }
                                ]
                            }}
                        />
                    </div>
                </div>
                <p className="alert alert-warning my-5 fw-bold" role="alert">
                    GPT-3 sometimes returns inaccurate data!
                    Remember to adjust portion sizes and ingredients as needed to meet your specific macro requirements. Additionally, be sure to drink plenty of water throughout the day and consult with a healthcare professional or registered dietitian before making any significant dietary changes.
                </p>
                <div className='my-5' >
                    <h3 className='mb-3'>
                        Meal Plan
                    </h3>
                    <p>
                        {
                            text.split('\n').map((line, idx) => {
                                return (
                                    <span key={'line-' + idx.toString()}>
                                        {line} <br />
                                    </span>
                                )
                            })
                        }
                    </p>
                </div>
                <RenameModal id={id} name={name} setMealPlansView={setMealPlansView} />
            </div>
        );
    }

export default SingleMealPlan;
