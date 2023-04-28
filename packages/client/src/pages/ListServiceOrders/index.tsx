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
import { DateInput } from '../../components/DateInput';
import moment from 'moment';
import { useFilterContext } from '../../contexts/FilterContext';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

export function ListServiceOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [orderToBeDeleted, setOrderToBeDeleted] = useState<string | null>(null);
  const {
    statusSelected,
    setStatusSelected,
    filterInput,
    setFilterInput,
    startDate,
    setStartDate,
    endDate,
    setEndDate
  } = useFilterContext();
  const { headerHeight } = useResponsiveContext();

  const { data: serviceOrders, refetch } = trpc.serviceOrder.list.useQuery();
  const serviceOrdersToShow = useMemo(() => serviceOrders
    ? serviceOrders.filter(
      (serviceOrder) => (
        ((serviceOrder.number?.toString().includes(filterInput) || ''.includes(filterInput)) ||
          serviceOrder.driver.name.includes(filterInput.toUpperCase()) ||
          serviceOrder.truck.plate.includes(filterInput.toUpperCase())) &&
        (statusSelected === 'ALL' ? true : serviceOrder.status === statusSelected) &&
        (startDate.length === 10 ? moment(serviceOrder.startDate).add(3, 'h').toDate() >= moment(startDate, 'DDMMYYYY').toDate() : true) &&
        (endDate.length === 10 ? moment(serviceOrder.startDate).add(3, 'h').toDate() <= moment(endDate, 'DDMMYYYY').toDate() : true)
      )
    )
    : [], [statusSelected, filterInput, serviceOrders, startDate, endDate]);

  function handleDeleteServiceOrder(id: string) {
    setOrderToBeDeleted(id);
    setDeleteModalIsVisible(true);
  }

  return (
    <Container headerHeight={headerHeight}>
      <Loader isLoading={!serviceOrders || isLoading} />
      <ConfirmDeleteModal
        isVisible={deleteModalIsVisible}
        setIsLoading={setIsLoading}
        onClose={() => {
          setDeleteModalIsVisible(false);
          setOrderToBeDeleted(null);
        }}
        onDelete={() => refetch()}
        orderId={orderToBeDeleted}
      />
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
        <div className="date-filter">
          <DateInput
            placeholder="De (Data Incial)"
            value={startDate}
            onChange={(value) => setStartDate(value)}
          />
          <DateInput
            placeholder="Até (Data Incial)"
            value={endDate}
            onChange={(value) => setEndDate(value)}
          />
        </div>
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
            onDelete={handleDeleteServiceOrder}
          />
        ))}
      </div>
    </Container>
  );
}
