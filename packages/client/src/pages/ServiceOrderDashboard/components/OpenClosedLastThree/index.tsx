import { useEffect, useMemo, useState } from 'react';
import { BarChart } from '../../../../components/BarChart';
import { trpcClient } from '../../../../lib/trpcClient';

export function OpenClosedLastThree() {
  const [openClosedLastThree, setOpenClosedLastThree] = useState<
    {
      month: string;
      totalOpen: number;
      totalClosed: number;
    }[]
  >([]);
  const highestValueLastThree = useMemo(
    () =>
      Math.max(
        ...openClosedLastThree.map((item) => item.totalOpen + item.totalClosed)
      ),
    [openClosedLastThree]
  );

  useEffect(() => {
    async function loadData() {
      const openClosedLastThreeData =
        await trpcClient.serviceOrderDashboard.openClosedTotalLastThreeMonths
          .query();

      setOpenClosedLastThree(openClosedLastThreeData);
    }

    loadData();
  }, []);

  return (
    <div className="chart-dashboard">
      <h2>RELAÇÃO ABERTO X FECHADO ÚLTIMOS 3 MESES</h2>
      <div className="container">
        <BarChart
          labels={openClosedLastThree.map((item) => item.month)}
          highestValue={highestValueLastThree}
          datasets={[
            {
              data: openClosedLastThree.map(
                (item) => item.totalClosed + item.totalOpen
              ),
              backgroundColor: '#1abc9c',
              borderColor: '#16a085',
              label: 'Total',
              borderWidth: 2,
              borderRadius: 4,
              barPercentage: 0.8,
            },
            {
              data: openClosedLastThree.map((item) => item.totalClosed),
              backgroundColor: '#3498db',
              borderColor: '#2980b9',
              label: 'Fechados',
              borderWidth: 2,
              borderRadius: 4,
              barPercentage: 0.8,
            },
          ]}
        />
      </div>
    </div>
  );
}
