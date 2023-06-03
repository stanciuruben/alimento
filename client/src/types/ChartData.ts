import type ChartDataSet from './ChartDataSet';

export default interface ChartData {
	labels: string[];
	datasets: ChartDataSet[];
}
