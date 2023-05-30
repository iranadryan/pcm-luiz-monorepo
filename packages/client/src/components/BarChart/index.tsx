import { ChartDataset } from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  labels: string[];
  datasets: ChartDataset<'bar', any>[];
  highestValue: number
}

export function BarChart({ labels, datasets, highestValue }: BarChartProps) {
  return (
    <Bar
      data={{
        labels: labels,
        datasets: datasets,
      }}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        font: {
          size: 12,
          family: '"Inter", sans-serif',
          weight: '500',
        },
        scales: {
          y: {
            min: 0,
            max: Math.ceil((highestValue * 1.1) / 30) * 30,
            grid: {
              display: false
            },
            ticks: {
              display: false
            },
            border: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'end',
            offset: -2,
            font: {
              size: 12,
              family: '"Inter", sans-serif',
              weight: 'bold',
            },
            clamp: true,
          },
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 12,
                family: '"Inter", sans-serif',
                weight: '500',
              },
            },
          },
        },
      }}
    />
  );
}
