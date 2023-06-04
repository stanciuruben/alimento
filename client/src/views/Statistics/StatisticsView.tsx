import { useMemo, type FC, useState } from 'react';
import './StatisticsView.css';

import type MealPlan from '../../types/MealPlan';
import type ChartDataSet from '../../types/ChartDataSet';
import formatDate from '../../lib/utils/formatDate';
import capitalizeString from '../../lib/utils/capitalizeString';

import BarChart from '../../components/Charts/BarChart';
import DoughnutChart from '../../components/Charts/DoughnutChart';

const StatisticsView: FC<{
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
        const [timeSpan, setTimeSpan] = useState<number>(7);
        const stats = useMemo(() => {
            if (mealPlansReqStatus === 'success' && selectedPlansReqStatus === 'success') {
                const data: any = {};
                const stats: {
                    labels: string[]
                    dataset: ChartDataSet
                    avg: {
                        protein: number
                        carbs: number
                        fat: number
                        ammount: 0
                    }
                } = {
                    labels: [],
                    dataset: {
                        label: 'Kilocalories',
                        data: []
                    },
                    avg: {
                        protein: 0,
                        carbs: 0,
                        fat: 0,
                        ammount: 0
                    }
                };
                selectedPlans.forEach(plan => {
                    data[plan.date] = {
                        name: mealPlans.find(mealPlan => mealPlan.id === plan.plan_id)?.name,
                        diet: mealPlans.find(mealPlan => mealPlan.id === plan.plan_id)?.diet,
                        protein: mealPlans.find(mealPlan => mealPlan.id === plan.plan_id)?.protein,
                        carbs: mealPlans.find(mealPlan => mealPlan.id === plan.plan_id)?.carbs,
                        fat: mealPlans.find(mealPlan => mealPlan.id === plan.plan_id)?.fat
                    }
                });
                const indexDate = new Date();
                indexDate.setDate(new Date().getDate() - timeSpan); // 30 Days before today
                while (formatDate(indexDate) !== formatDate(new Date())) {
                    if (data[formatDate(indexDate)] !== undefined) {
                        // Linear Data
                        const name: string = data[formatDate(indexDate)].name;
                        const diet: string = data[formatDate(indexDate)].diet;
                        const protein: number = data[formatDate(indexDate)].protein;
                        const carbs: number = data[formatDate(indexDate)].carbs;
                        const fat: number = data[formatDate(indexDate)].fat;
                        const kcal: number = ((protein + carbs) * 4) + fat * 9;
                        stats.dataset.data.push(kcal)
                        stats.labels.push(
                            indexDate.toLocaleDateString('en-GB') +
                            `\n Plan: ${capitalizeString(name)}` +
                            `\n Diet: ${capitalizeString(diet)}` +
                            `\n Protein: ${protein}g` +
                            `\n Carbs: ${carbs}g` +
                            `\n Fat: ${fat}g`
                        );
                        // Average Data
                        stats.avg.protein += protein;
                        stats.avg.carbs += carbs;
                        stats.avg.fat += fat;
                        stats.avg.ammount++;
                    } else {
                        stats.dataset.data.push(0)
                        stats.labels.push(indexDate.toLocaleDateString('en-GB'));
                    }
                    indexDate.setDate(indexDate.getDate() + 1);
                }
                return stats;
            }
            return null;
        }, [
            mealPlans,
            mealPlansReqStatus,
            selectedPlans,
            selectedPlansReqStatus,
            timeSpan
        ]);

        const getValuePercentage = (p: number, c: number, f: number): {
            p: {
                value: string
                percentage: string
            }
            c: {
                value: string
                percentage: string
            }
            f: {
                value: string
                percentage: string
            }
        } => {
            const kcal = ((p + c) * 4) + f * 9;
            return {
                p: {
                    value: p.toString(),
                    percentage: (p * 4 / kcal * 100).toPrecision(4)
                },
                c: {
                    value: c.toString(),
                    percentage: (c * 4 / kcal * 100).toPrecision(4)
                },
                f: {
                    value: f.toString(),
                    percentage: (f * 9 / kcal * 100).toPrecision(4)
                }
            }
        }

        return <div className="container my-3">
            <div className="input-group">
                <label className="input-group-text" htmlFor="">
                    <i className="bi bi-calendar-week"></i>
                </label>
                <select
                    className="form-select"
                    aria-label="Filter select"
                    value={timeSpan.toString()}
                    onChange={(e) => {
                        setTimeSpan(parseInt(e.target.value))
                    }}
                >
                    <option value="7">Past 7 Days</option>
                    <option value="14">Past 14 Days</option>
                    <option value="30">Past 30 Days</option>
                </select>
            </div>
            {
                mealPlansReqStatus === 'success' && selectedPlansReqStatus === 'success' && stats !== null
                    ? <>
                        <div className="chart-container">
                            <BarChart
                                timeSpan={timeSpan}
                                chartData={{
                                    labels: stats.labels.slice(stats.labels.length - timeSpan, undefined),
                                    datasets: [{
                                        label: stats.dataset.label,
                                        data: stats.dataset.data.slice(stats.dataset.data.length - timeSpan, undefined)
                                    }]
                                }}
                                id={timeSpan.toString() + '-days-overview'}
                                title={timeSpan.toString() + ' Days Overview'}
                            />
                        </div>
                        <div className="row my-5">
                            {(() => {
                                const avgStats = getValuePercentage(
                                    Math.floor(stats.avg.protein / stats.avg.ammount),
                                    Math.floor(stats.avg.carbs / stats.avg.ammount),
                                    Math.floor(stats.avg.fat / stats.avg.ammount)
                                );
                                return <>
                                    <div className="chart-container col-md-6">
                                        <DoughnutChart
                                            timeSpan={timeSpan}
                                            chartData={{
                                                labels: ['Protein', 'Carbohidrates', 'Fat'],
                                                datasets: [
                                                    {
                                                        label: 'Average intake',
                                                        data: [
                                                            parseFloat(avgStats.p.percentage),
                                                            parseFloat(avgStats.c.percentage),
                                                            parseFloat(avgStats.f.percentage)
                                                        ]
                                                    }
                                                ]
                                            }}
                                            id={timeSpan.toString() + '-days-average'}
                                            title={timeSpan.toString() + ' Days Average'}
                                        />
                                    </div>
                                    <div className="col-md-6 my-5">
                                        <h3 className='ms-3'>Average Stats for the past {timeSpan} days</h3>
                                        <ul className='list-group list-group-flush'>
                                            <li className='list-group-item'>
                                                Protein: {avgStats.p.value}g
                                            </li>
                                            <li className='list-group-item'>
                                                Protein To Kcal Ratio: {avgStats.p.percentage}%
                                            </li>
                                            <li className='list-group-item'>
                                                Carbohidrates: {avgStats.c.value}g
                                            </li>
                                            <li className='list-group-item'>
                                                Carbohidrates To Kcal Ratio: {avgStats.c.percentage}%
                                            </li>
                                            <li className='list-group-item'>
                                                Fat: {avgStats.f.value}g
                                            </li>
                                            <li className='list-group-item'>
                                                Fat To Kcal Ratio: {avgStats.f.percentage}%
                                            </li>
                                            <li className='list-group-item'>
                                                App Usage: {stats.avg.ammount} / {timeSpan} Days
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            })()}
                        </div>
                    </>
                    : <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
            }
        </div>;
    }

export default StatisticsView;
