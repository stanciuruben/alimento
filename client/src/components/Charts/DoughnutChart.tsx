import { useEffect, type FC, useRef } from 'react';
import Chart from 'chart.js/auto';

import type ChartData from '../../types/ChartData';

const DoughnutChart: FC<{
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
                    type: 'doughnut',
                    data: {
                        labels: chartData.labels,
                        datasets: chartData.datasets.map(dataset => ({
                            label: dataset.label,
                            data: dataset.data,
                            backgroundColor: [
                                '#ff6384',
                                '#ffcd56',
                                '#d6d5c9'
                            ],
                            hoverBackgroundColor: 'rgba(206, 50, 163, 1)',
                            borderColor: 'rgba(85, 81, 225, 0.2)',
                            hoverBorderColor: 'rgba(206, 50, 163, 1)'
                        }))
                    },
                    options: {
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            },
                            title: {
                                display: false
                            },
                            tooltip: {
                                titleAlign: 'center',
                                xAlign: 'center',
                                borderWidth: 3,
                                borderColor: 'rgba(85, 81, 225, 1)',
                                backgroundColor: '#1f2937',
                                callbacks: {
                                    label: (context) => {
                                        return context.label + ' to Kcal: ' + context.formattedValue + '%';
                                    }
                                }
                            }
                        }

                    }
                }
            );

            return () => {
                chart.destroy();
            }
        }, [timeSpan]);

        return (
            <canvas
                ref={canvas}
                id={id}
                aria-label={title}
                role="img"
            ></canvas>
        );
    }

export default DoughnutChart;
