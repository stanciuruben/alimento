import { useEffect, type FC, useRef } from 'react';
import Chart from 'chart.js/auto';

import type ChartData from '../../types/ChartData';

const BarChart: FC<{
    timeSpan: number
    chartData: ChartData
    id: string
    title: string
}> = ({
    timeSpan,
    chartData,
    id,
    title
}) => {
        const canvas = useRef<HTMLCanvasElement>(null);

        useEffect(() => {
            Chart.defaults.color = '#000000';

            const chart = new Chart(
                // @ts-expect-error next
                canvas.current,
                {
                    type: 'bar',
                    data: {
                        labels: chartData.labels,
                        datasets: chartData.datasets.map(dataset => ({
                            label: dataset.label,
                            data: dataset.data,
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            hoverBackgroundColor: 'rgba(206, 50, 163, 1)',
                            borderColor: '#5423bb',
                            hoverBorderColor: 'rgba(206, 50, 163, 1)',
                            borderWidth: 2,
                            borderRadius: 40 - timeSpan,
                            barThickness: 40 - timeSpan
                        }))
                    },
                    options: {
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true
                            },
                            title: {
                                align: 'start',
                                position: 'top',
                                text: title,
                                display: true,
                                font: {
                                    size: 16,
                                    weight: 'normal'
                                },
                                padding: 30
                            },
                            tooltip: {
                                titleAlign: 'center',
                                xAlign: 'center',
                                borderWidth: 3,
                                borderColor: 'transparent',
                                backgroundColor: 'rgb(0, 0, 0)'
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    color: 'transparent'
                                },
                                ticks: {
                                    callback: function (value: number, _index: number, ticks: any[]) {
                                        const daysAheadOfToday = ticks.length - value - 1;
                                        const currentDate = new Date();
                                        currentDate.setDate(new Date().getDate() - daysAheadOfToday);
                                        const currentDay = currentDate.getDate() < 10 ? '0' + currentDate.getDate().toString() : currentDate.getDate().toString();
                                        const currentMonth = currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1).toString() : (currentDate.getMonth() + 1).toString();
                                        return currentDay + '/' + currentMonth;
                                    }
                                }
                            },
                            y: {
                                grid: {
                                    color: 'rgba(206, 50, 163, 0.1)'
                                }
                            }
                        }

                    }
                }
            );

            return () => {
                chart.destroy();
            }
        }, [chartData]);

        return (
            <canvas
                ref={canvas}
                id={id}
                aria-label={title}
                role="img"
            ></canvas>
        );
    }

export default BarChart;
