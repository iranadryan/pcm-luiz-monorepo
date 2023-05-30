import moment from 'moment';
import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { useEffect, useMemo, useState } from 'react';
import { DateInput } from '../../../../components/DateInput';
import { VerticalBarChart } from '../../../../components/VerticalBarChart';
import { trpcClient } from '../../../../lib/trpcClient';
import { toast } from '../../../../utils/toast';

const NUM_OF_BARS = 7;

export function TotalByMechanic() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalByMechanic, setTotalByMechanic] = useState<
    {
      total: number;
      mechanic: string;
    }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const dataShowing = useMemo(
    () =>
      totalByMechanic.slice(
        currentPage * NUM_OF_BARS,
        (currentPage + 1) * NUM_OF_BARS
      ),
    [currentPage, totalByMechanic]
  );
  const highestValue = useMemo(
    () => Math.max(...dataShowing.map((item) => item.total)),
    [dataShowing]
  );

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

      const totalByMechanicData =
        await trpcClient.serviceOrderDashboard.totalByMechanic.query({
          startDate: parsedStartDate,
          endDate: parsedEndDate
        });

      setTotalByMechanic(totalByMechanicData);
      setCurrentPage(0);
    }

    loadData();
  }, [endDate, startDate]);

  return (
    <div className="chart-dashboard">
      <header>
        <h2>TOTAL DE SERVIÇOS POR MECÂNICO</h2>
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
        <div className="chart-container">
          <VerticalBarChart
            labels={dataShowing.map((item) => item.mechanic)}
            highestValue={highestValue}
            datasets={[
              {
                data: dataShowing.map((item) => item.total),
                backgroundColor: [
                  '#f1c40f',
                  '#1abc9c',
                  '#2ecc71',
                  '#3498db',
                  '#9b59b6',
                  '#34495e',
                  '#e67e22',
                  '#e74c3c',
                ],
                borderRadius: 6,
                barPercentage: 0.8,
              },
            ]}
          />
        </div>
        <footer className="paginator">
          <button
            aria-label="previous-page"
            className={`${currentPage === 0 ? 'hidden' : ''}`}
            onClick={() => setCurrentPage((prevState) => prevState - 1)}
          >
            <ArrowLeft color="#222" size={18} />
          </button>
          <span>
            {currentPage + 1}
            {' '}de{' '}
            {Math.ceil(totalByMechanic.length / NUM_OF_BARS)}
          </span>
          <button
            aria-label="next-page"
            className={`${
              (currentPage + 1) * NUM_OF_BARS >= totalByMechanic.length
                ? 'hidden'
                : ''
            }`}
            onClick={() => setCurrentPage((prevState) => prevState + 1)}
          >
            <ArrowRight color="#222" size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
}
