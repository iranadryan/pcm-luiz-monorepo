import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { useEffect, useMemo, useState } from 'react';
import { VerticalBarChart } from '../../../../components/VerticalBarChart';
import { trpcClient } from '../../../../lib/trpcClient';

const NUM_OF_BARS = 7;

export function TotalByService() {
  const [totalByService, setTotalByService] = useState<
    {
      total: number;
      service: string;
    }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const dataShowing = useMemo(
    () =>
      totalByService.slice(
        currentPage * NUM_OF_BARS,
        (currentPage + 1) * NUM_OF_BARS
      ),
    [currentPage, totalByService]
  );
  const highestValueLastThree = useMemo(
    () => Math.max(...dataShowing.map((item) => item.total)),
    [dataShowing]
  );

  useEffect(() => {
    async function loadData() {
      const totalByServiceData =
        await trpcClient.serviceOrderDashboard.totalByService.query();

      setTotalByService(totalByServiceData);
    }

    loadData();
  }, []);

  return (
    <div className="chart-dashboard">
      <h2>TOTAL DE SERVIÇOS ABERTOS POR SERVIÇO</h2>
      <div className="container">
        <div className="chart-container">
          <VerticalBarChart
            labels={dataShowing.map((item) => item.service)}
            highestValue={highestValueLastThree}
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
                borderColor: [
                  '#f39c12',
                  '#16a085',
                  '#27ae60',
                  '#2980b9',
                  '#8e44ad',
                  '#2c3e50',
                  '#d35400',
                  '#c0392b',
                ],
                borderWidth: 2,
                borderRadius: 4,
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
            {Math.ceil(totalByService.length / NUM_OF_BARS)}
          </span>
          <button
            aria-label="next-page"
            className={`${
              (currentPage + 1) * NUM_OF_BARS >= totalByService.length
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
