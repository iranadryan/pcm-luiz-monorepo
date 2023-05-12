import { ChartDataset } from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface VerticalBarChartProps {
  labels: string[];
  datasets: ChartDataset<'bar', any>[];
  highestValue: number;
}

export function VerticalBarChart({
  labels,
  datasets,
  highestValue,
}: VerticalBarChartProps) {
  return (
    <Bar
      data={{
        labels: labels.map((label) => `${label.slice(0, 20)}${label.length > 20 ? '...' : ''}`),
        datasets: datasets,
      }}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        indexAxis: 'y',
        font: {
          size: 12,
          family: '"Inter", sans-serif',
          weight: '500',
        },
        scales: {
          x: {
            max: Math.ceil((highestValue * 1.1) / 50) * 50,
          },
        },
        plugins: {
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'end',
            offset: 0,
            font: {
              size: 12,
              family: '"Inter", sans-serif',
              weight: 'bold',
            },
            clamp: true,
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title(this, tooltipItems) {
                return labels[tooltipItems[0].dataIndex];
              },
            }
          }
        },
      }}
    />
  );
}
