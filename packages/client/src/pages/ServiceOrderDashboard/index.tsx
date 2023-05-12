import { useEffect, useState } from 'react';
import { Title } from '../../components/Title';
import { Container } from './styles';
import { trpcClient } from '../../lib/trpcClient';
import { Archive, CheckCircle, ClockClockwise } from 'phosphor-react';
import { OpenClosedLastThree } from './components/OpenClosedLastThree';
import { TotalByService } from './components/TotalByService';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

export function ServiceOrderDashboard() {
  const [openClosedTotal, setOpenClosedTotal] = useState<{
    openTotal: number;
    closedTotal: number;
  }>({
    openTotal: 0,
    closedTotal: 0,
  });
  const { headerHeight } = useResponsiveContext();

  useEffect(() => {
    async function loadData() {
      const openClosedData =
        await trpcClient.serviceOrderDashboard.openClosedTotal.query();

      setOpenClosedTotal(openClosedData);
    }

    loadData();
  }, []);

  return (
    <Container headerHeight={headerHeight}>
      <header>
        <Title title="DASHBOARD - ORDENS DE SERVIÇO" />
      </header>
      <main>
        <div className="open-closed-totalizer">
          <div className="card">
            <span>
              <Archive color="#48AF7A" size={20} weight="duotone" />
              Total
            </span>
            <strong>
              {openClosedTotal.openTotal + openClosedTotal.closedTotal}
            </strong>
          </div>
          <div className="card">
            <span>
              <ClockClockwise color="#48AF7A" size={20} weight="duotone" />
              Pendentes
            </span>
            <strong>{openClosedTotal.openTotal}</strong>
          </div>
          <div className="card">
            <span>
              <CheckCircle color="#48AF7A" size={20} weight="duotone" />
              Fechadas
            </span>
            <strong>{openClosedTotal.closedTotal}</strong>
          </div>
        </div>
        <OpenClosedLastThree />
        <TotalByService />
      </main>
      {/* <div className="chart-dashboard">
        <h2>Ordens Aberto x Fechado</h2>
        <div className="chart-container">
          <Doughnut
            data={{
              labels: openClosedTotal.map((item) => item.label),
              datasets: [{
                data: openClosedTotal.map((item) => item.total),
                borderWidth: 1,
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
                ]
              }]
            }}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
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
      </div> */}
    </Container>
  );
}
