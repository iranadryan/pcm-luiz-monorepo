import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Option, Select } from '../../../../components/Select';
import { trpcClient } from '../../../../lib/trpcClient';
import { formatHours } from '../../../../utils/formatHours';
import { formatNumber } from '../../../../utils/formatNumber';

export function TotalWorkHours() {
  const [mechanicOptions, setMechanicOptions] = useState<Option[]>([]);
  const [selectedMechanic, setSelectedMechanic] = useState<string | null>(null);
  const [workHours, setWorkHours] = useState<{
    weekTotal: {
        mechanic: string;
        hours: number;
        hoursFormatted: string;
    };
  }>({
    weekTotal: {
      mechanic: '',
      hours: 0,
      hoursFormatted: '00:00'
    }
  });

  useEffect(() => {
    async function loadData() {
      const mechanics = await trpcClient.person.list.query('MECHANIC');

      setMechanicOptions(mechanics.map((mechanic) => ({
        label: mechanic.name,
        value: mechanic.id
      })));
      setSelectedMechanic(mechanics[0]?.id || null);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!selectedMechanic) {
        return;
      }

      const workHoursData = await trpcClient.serviceOrderDashboard
        .totalServiceHoursByMechanic.query(selectedMechanic);

      setWorkHours(workHoursData);
    }

    loadData();
  }, [selectedMechanic]);

  return (
    <div className="chart-dashboard">
      <header>
        <h2>TOTAL DE SERVIÇOS POR SERVIÇO</h2>
        <Select
          options={mechanicOptions}
          selected={selectedMechanic}
          onSelect={setSelectedMechanic}
          secondary
        />
      </header>
      <div className="container">
        <div className="center-content">
          <strong>{formatNumber((workHours.weekTotal.hours * 100) / 44, '%', 1)}</strong>
          <span>DA META SEMANAL</span>
        </div>
        <Doughnut
          data={{
            labels: ['Realizadas', 'Restantes'],
            datasets: [{
              data: [workHours.weekTotal.hours, 44 - workHours.weekTotal.hours],
              backgroundColor: [
                '#1abc9c',
                'rgba(204, 204, 204, 0.5)'
              ],
              borderWidth: 0,
            }]
          }}
          options={{
            maintainAspectRatio: false,
            cutout: '60%',
            layout: {
              padding: 10,
            },
            responsive: true,
            plugins: {
              datalabels: {
                display: false
              },
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label(this, tooltipItem) {
                    if (tooltipItem.label === 'Realizadas') {
                      return workHours.weekTotal.hoursFormatted;
                    }

                    return formatHours(44 - workHours.weekTotal.hours);
                  },
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
