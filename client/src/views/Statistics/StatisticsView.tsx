import { useMemo, type FC, useState } from 'react';
import './StatisticsView.css';

import type MealPlan from '../../types/MealPlan';
import type ChartDataSet from '../../types/ChartDataSet';
import formatDate from '../../lib/utils/formatDate';
import capitalizeString from '../../lib/utils/capitalizeString';

import BarChart from '../../components/Charts/BarChart';

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
                } = {
                    labels: [],
                    dataset: {
                        label: 'Kilocalories',
                        data: []
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
                indexDate.setDate(new Date().getDate() - 30); // 30 Days before today
                while (formatDate(indexDate) !== formatDate(new Date())) {
                    if (data[formatDate(indexDate)] !== undefined) {
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
                    ? <div className="chart-container">
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
                    : <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
            }
        </div>;
    }

export default StatisticsView;
