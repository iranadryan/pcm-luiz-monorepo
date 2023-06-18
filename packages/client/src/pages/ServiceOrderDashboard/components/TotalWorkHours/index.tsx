import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Option, Select } from '../../../../components/Select';
import { trpcClient } from '../../../../lib/trpcClient';
import { formatHours } from '../../../../utils/formatHours';
import { formatNumber } from '../../../../utils/formatNumber';
import { DateInput } from '../../../../components/DateInput';
import moment from 'moment';
import { toast } from '../../../../utils/toast';

export function TotalWorkHours() {
  const [startDate, setStartDate] = useState(moment().weekday(1).format('DD/MM/YYYY'));
  const [endDate, setEndDate] = useState(moment().weekday(7).format('DD/MM/YYYY'));
  const [mechanicOptions, setMechanicOptions] = useState<Option[]>([]);
  const [selectedMechanic, setSelectedMechanic] = useState<string | null>(null);
  const [workHours, setWorkHours] = useState<{
    weekTotal: {
        mechanic: string;
        hours: number;
        hoursFormatted: string;
    };
    goalHours: number;
  }>({
    weekTotal: {
      mechanic: '',
      hours: 0,
      hoursFormatted: '00:00'
    },
    goalHours: 0
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

      if (startDate.length !== 10 || endDate.length !== 10) {
        return;
      }

      const parsedStartDate = moment(startDate, 'DD/MM/YYYY').toDate();
      const parsedEndDate = moment(endDate, 'DD/MM/YYYY').toDate();

      if (parsedStartDate > parsedEndDate) {
        return toast({
          type: 'danger',
          text: 'Data final deve ser maior que inicial',
          duration: 4000
        });
      }

      const workHoursData = await trpcClient.serviceOrderDashboard
        .totalServiceHoursByMechanic.query({
          mechanicId: selectedMechanic,
          startDate: parsedStartDate,
          endDate: parsedEndDate
        });

      setWorkHours(workHoursData);
    }

    loadData();
  }, [selectedMechanic, startDate, endDate]);

  return (
    <div className="chart-dashboard">
      <header>
        <h2>HORAS TRABALHADAS</h2>
        <div className="filters">
          <Select
            options={mechanicOptions}
            selected={selectedMechanic}
            onSelect={setSelectedMechanic}
            secondary
          />
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
        </div>
      </header>
      <div className="container">
        <div className="center-content">
          <strong>{formatNumber((workHours.weekTotal.hours * 100) / workHours.goalHours, '%', 1)}</strong>
          <span>
            {workHours.weekTotal.hoursFormatted}
            {' '}DE{' '}
            {formatHours(workHours.goalHours)}
          </span>
        </div>
        <Doughnut
          style={{
            zIndex:10
          }}
          data={{
            labels: ['Realizadas', 'Restantes'],
            datasets: [{
              data: [
                workHours.weekTotal.hours,
                workHours.goalHours - workHours.weekTotal.hours
              ],
              backgroundColor: [
                '#1abc9c',
                'rgba(204, 204, 204, 0.5)'
              ],
              borderWidth: 0,
            }]
          }}
          options={{
            maintainAspectRatio: false,
            cutout: '65%',
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

                    return formatHours(
                      workHours.goalHours - workHours.weekTotal.hours
                    );
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
