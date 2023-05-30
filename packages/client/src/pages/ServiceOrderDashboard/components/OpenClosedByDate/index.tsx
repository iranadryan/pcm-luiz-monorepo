import moment from 'moment';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { DateInput } from '../../../../components/DateInput';
import { trpcClient } from '../../../../lib/trpcClient';
import { toast } from '../../../../utils/toast';

export function OpenClosedByDate() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openClosedTotal, setOpenClosedTotal] = useState<{
    openTotal: number;
    closedTotal: number;
    launchedTotal: number;
  }>({
    openTotal: 0,
    closedTotal: 0,
    launchedTotal: 0,
  });

  useEffect(() => {
    async function loadData() {
      if (
        ![0, 10].includes(startDate.length) ||
        ![0, 10].includes(endDate.length)
      ) {
        return;
      }

      const parsedStartDate = startDate.length === 10
        ? moment(startDate, 'DD/MM/YYYY').toDate()
        : null;
      const parsedEndDate = endDate.length === 10
        ? moment(endDate, 'DD/MM/YYYY').toDate()
        : null;

      if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
        return toast({
          type: 'danger',
          text: 'Data final deve ser maior que inicial',
          duration: 4000
        });
      }

      const openClosedData =
        await trpcClient.serviceOrderDashboard.openClosedTotal.query({
          startDate: parsedStartDate,
          endDate: parsedEndDate
        });

      setOpenClosedTotal(openClosedData);
    }

    loadData();
  }, [endDate, startDate]);

  return (
    <div className="chart-dashboard">
      <header>
        <h2>ORDENS TOTAIS</h2>
        <div className="range-input">
          <DateInput
            value={startDate}
            onChange={setStartDate}
            placeholder="Data inicial"
            secondary
          />
          à
          <DateInput
            value={endDate}
            onChange={setEndDate}
            placeholder="Data final"
            secondary
          />
        </div>
      </header>
      <div className="container">
        <Doughnut
          data={{
            labels: ['Abertas', 'Fechados', 'Lançados'],
            datasets: [{
              data: [
                openClosedTotal.openTotal,
                openClosedTotal.closedTotal,
                openClosedTotal.launchedTotal
              ],
              backgroundColor: [
                '#f1c40f',
                '#1abc9c',
                '#3498db',
                '#2ecc71',
                '#9b59b6',
                '#34495e',
                '#e67e22',
                '#e74c3c',
              ],
              borderWidth: 0
            }]
          }}
          options={{
            maintainAspectRatio: false,
            layout: {
              padding: 10,
            },
            responsive: true,
            plugins: {
              datalabels: {
                display: false
              },
              legend: {
                position: 'right',
                labels: {
                  font: {
                    size: 12,
                    family: '"Inter", sans-serif',
                    weight: '500'
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
