import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'phosphor-react';
import { trpc } from '../../lib/trpc';

import { Container } from './styles';
import { Title } from '../../components/Title';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { ServiceOrderCard } from './components/ServiceOrderCard';
import { NoData } from '../../components/NoData';
import { Loader } from '../../components/Loader';

export function ListServiceOrders() {
  const [statusSelected, setStatusSelected] = useState('ALL');
  const [filterInput, setFilterInput] = useState('');

  const { data: serviceOrders } = trpc.serviceOrder.list.useQuery();
  const serviceOrdersToShow = useMemo(() => serviceOrders
    ? serviceOrders.filter(
      (serviceOrder) => (
        ((serviceOrder.number?.toString().includes(filterInput) || ''.includes(filterInput)) ||
          serviceOrder.driver.name.includes(filterInput.toUpperCase()) ||
          serviceOrder.truck.plate.includes(filterInput.toUpperCase())) &&
        (statusSelected === 'ALL' ? true : serviceOrder.status === statusSelected)
      )
    )
    : [], [statusSelected, filterInput, serviceOrders]);

  return (
    <Container>
      <Loader isLoading={!serviceOrders} />
      <Link to="new" className="new-order">
        <Plus color="#FFFFFF" size={24} weight="bold" />
      </Link>
      <div className="filters">
        <Input
          placeholder="Número da OS, Placa ou Motorista"
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
        />
        <Select
          options={[
            { value: 'ALL', label: 'Todas' },
            { value: 'OPEN', label: 'Abertas' },
            { value: 'CLOSED', label: 'Fechadas' },
          ]}
          placeholder="Estado da ordem"
          selected={statusSelected}
          onSelect={setStatusSelected}
        />
      </div>
      <Title title="ORDENS DE SERVIÇO" />
      <div className="cards-list">
        {serviceOrdersToShow.length === 0 && (
          <NoData
            title="Nenhuma ordem encontrada!"
            text="Tente mudar os filtros, talvez apareçam."
          />
        )}
        {serviceOrdersToShow.map((serviceOrder) => (
          <ServiceOrderCard
            key={serviceOrder.id}
            serviceOrder={serviceOrder}
          />
        ))}
      </div>
    </Container>
  );
}
