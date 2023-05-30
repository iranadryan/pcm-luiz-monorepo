import { useEffect, useState } from 'react';
import { Title } from '../../components/Title';
import { Container } from './styles';
import { trpcClient } from '../../lib/trpcClient';
import { Archive, ArchiveBox, CheckCircle, ClockClockwise } from 'phosphor-react';
import { OpenClosedLastThree } from './components/OpenClosedLastThree';
import { TotalByService } from './components/TotalByService';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';
import { OpenClosedByDate } from './components/OpenClosedByDate';
import { TotalByDriver } from './components/TotalByDriver';
import { TotalByMechanic } from './components/TotalByMechanic';
import { TotalWorkHours } from './components/TotalWorkHours';

export function ServiceOrderDashboard() {
  const [openClosedTotal, setOpenClosedTotal] = useState<{
    openTotal: number;
    closedTotal: number;
    launchedTotal: number;
  }>({
    openTotal: 0,
    closedTotal: 0,
    launchedTotal: 0,
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
              {openClosedTotal.openTotal +
              openClosedTotal.closedTotal +
              openClosedTotal.launchedTotal}
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
          <div className="card">
            <span>
              <ArchiveBox color="#48AF7A" size={20} weight="duotone" />
              Lançadas
            </span>
            <strong>{openClosedTotal.launchedTotal}</strong>
          </div>
        </div>
        <OpenClosedByDate />
        <OpenClosedLastThree />
        <TotalByService />
        <TotalByDriver />
        <TotalWorkHours />
        <TotalByMechanic />
      </main>
    </Container>
  );
}
