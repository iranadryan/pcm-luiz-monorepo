import { useMemo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FadersHorizontal, Plus } from 'phosphor-react';
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
import { trpcClient } from '../../lib/trpcClient';
import { IServiceOrder, ServiceOrderStatus } from '../../types/ServiceOrder';

export function ListServiceOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [serviceOrders, setServiceOrders] = useState<IServiceOrder[]>([]);
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
    setEndDate,
  } = useFilterContext();
  const { headerHeight } = useResponsiveContext();
  const serviceOrdersToShow = useMemo(
    () =>
      serviceOrders
        ? serviceOrders.filter(
            (serviceOrder) =>
              serviceOrder.number?.toString().includes(filterInput) ||
              ''.includes(filterInput) ||
              serviceOrder.driver.name.includes(filterInput.toUpperCase()) ||
              serviceOrder.truck.plate.includes(filterInput.toUpperCase()),
          )
        : [],
    [filterInput, serviceOrders],
  );

  function handleDeleteServiceOrder(id: string) {
    setOrderToBeDeleted(id);
    setDeleteModalIsVisible(true);
  }

  const handleLoadServiceOrders = useCallback(async () => {
    if (
      ![0, 10].includes(startDate.length) ||
      ![0, 10].includes(endDate.length)
    ) {
      return null;
    }

    setIsLoading(true);

    const parsedStartDate =
      startDate.length === 0 ? null : moment(startDate, 'DD/MM/YYYY').toDate();
    const parsedEndDate =
      endDate.length === 0 ? null : moment(endDate, 'DD/MM/YYYY').toDate();
    const parsedStatus =
      statusSelected === 'ALL' ? null : (statusSelected as ServiceOrderStatus);

    const data = await trpcClient.serviceOrder.list.query({
      status: parsedStatus,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    });

    setServiceOrders(data);
    setIsLoading(false);
  }, [statusSelected, startDate, endDate]);

  useEffect(() => {
    handleLoadServiceOrders();
  }, [handleLoadServiceOrders]);

  return (
    <Container headerHeight={headerHeight} showFilters={showFilters}>
      <Loader isLoading={isLoading} />
      <ConfirmDeleteModal
        isVisible={deleteModalIsVisible}
        setIsLoading={setIsLoading}
        onClose={() => {
          setDeleteModalIsVisible(false);
          setOrderToBeDeleted(null);
        }}
        onDelete={() => handleLoadServiceOrders()}
        orderId={orderToBeDeleted}
      />
      <Link to="new" className="new-order">
        <Plus color="#FFFFFF" size={24} weight="bold" />
      </Link>
      <div className="filters">
        <div className="input-container">
          <Input
            placeholder="Número da OS, Placa ou Motorista"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />
          <button onClick={() => setShowFilters((prevState) => !prevState)}>
            <FadersHorizontal color="#007f4e" size={20} weight="bold" />
          </button>
        </div>
        {showFilters && (
          <>
            <Select
              options={[
                { value: 'ALL', label: 'Todas' },
                { value: 'OPEN', label: 'Abertas' },
                { value: 'CLOSED', label: 'Fechadas' },
                { value: 'LAUNCHED', label: 'Lançadas' },
                { value: 'SCHEDULED', label: 'Programadas' },
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
                placeholder="Até (Data Final)"
                value={endDate}
                onChange={(value) => setEndDate(value)}
              />
            </div>
          </>
        )}
      </div>
      <div className="title">
        <Title title="ORDENS DE SERVIÇO" />
        {startDate && !endDate && <span>A partir de {startDate}</span>}
        {!startDate && endDate && <span>Até {endDate}</span>}
        {startDate && endDate && <span>{`${startDate} - ${endDate}`}</span>}
      </div>
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
