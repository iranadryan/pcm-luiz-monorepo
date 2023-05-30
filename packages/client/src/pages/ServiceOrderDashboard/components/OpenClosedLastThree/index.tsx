import { useEffect, useMemo, useState } from 'react';
import { BarChart } from '../../../../components/BarChart';
import { trpcClient } from '../../../../lib/trpcClient';

export function OpenClosedLastThree() {
  const [openClosedLastThree, setOpenClosedLastThree] = useState<
    {
      month: string;
      totalOpen: number;
      totalClosed: number;
      totalLaunched: number;
    }[]
  >([]);
  const highestValueLastThree = useMemo(
    () =>
      Math.max(
        ...openClosedLastThree.map((item) => (
          item.totalOpen + item.totalClosed + item.totalLaunched
        ))
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
      <h2>RELAÇÃO ÚLTIMOS 3 MESES</h2>
      <div className="container">
        <BarChart
          labels={openClosedLastThree.map((item) => item.month)}
          highestValue={highestValueLastThree}
          datasets={[
            {
              data: openClosedLastThree.map((item) => item.totalOpen),
              backgroundColor: '#f1c40f',
              label: 'Abertas',
              borderRadius: 6,
              barPercentage: 0.8,
            },
            {
              data: openClosedLastThree.map((item) => item.totalClosed),
              backgroundColor: '#1abc9c',
              label: 'Fechados',
              borderRadius: 6,
              barPercentage: 0.8,
            },
            {
              data: openClosedLastThree.map((item) => item.totalLaunched),
              backgroundColor: '#3498db',
              label: 'Lançados',
              borderRadius: 6,
              barPercentage: 0.8,
            },
          ]}
        />
      </div>
    </div>
  );
}
