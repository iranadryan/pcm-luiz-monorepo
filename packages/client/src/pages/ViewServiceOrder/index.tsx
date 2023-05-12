import moment from 'moment';
import { ArrowLeft, Check, Export, Hash } from 'phosphor-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';
import { Title } from '../../components/Title';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';
import { trpc } from '../../lib/trpc';
import { formatNumber } from '../../utils/formatNumber';
import { takeTwoNames } from '../../utils/takeTwoNames';
import { ChangeNumberModal } from './components/ChangeNumberModal';
import { CloseOrderModal } from './components/CloseOrderModal';
import { Container } from './styles';

export function ViewServiceOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [closeOrderModalIsVisible, setCloseOrderModalIsVisible] =
    useState(false);
  const [changeNumberModalIsVisible, setChangeNumberModalIsVisible] =
    useState(false);
  const { id } = useParams();
  const { headerHeight } = useResponsiveContext();

  if (!id) {
    return null;
  }

  const { data: serviceOrder, refetch } = trpc.serviceOrder.get.useQuery(id);
  const serviceOrderMutation = trpc.serviceOrder.export.useMutation();

  async function exportServiceOrder() {
    setIsLoading(true);
    if (!id) {
      return;
    }

    const data = await serviceOrderMutation.mutateAsync(id);

    const link = document.createElement('a');
    link.href = data;
    link.target = '_blank';
    link.download = `ORDEM DE SERVIÇO #${serviceOrder?.number}.pdf`;
    link.click();
    setIsLoading(false);
  }

  return (
    <Container headerHeight={headerHeight}>
      <Loader isLoading={!serviceOrder || isLoading} />
      <CloseOrderModal
        isVisible={closeOrderModalIsVisible}
        closeModal={(closed: boolean) => {
          setCloseOrderModalIsVisible(false);
          if (closed) {
            refetch();
          }
        }}
        serviceOrderId={id}
        onIsLoading={setIsLoading}
      />
      <ChangeNumberModal
        isVisible={changeNumberModalIsVisible}
        closeModal={(closed: boolean) => {
          setChangeNumberModalIsVisible(false);
          if (closed) {
            refetch();
          }
        }}
        serviceOrderId={id}
        number={serviceOrder?.number || null}
        onIsLoading={setIsLoading}
      />
      <header>
        <Link to="/service-orders" className="back-button">
          <ArrowLeft color="#FFFFFF" size={24} weight="bold" />
        </Link>
        <Title
          title={serviceOrder?.number ? `ORDEM #${serviceOrder?.number}` : 'ORDEM SEM NÚMERO'}
        />
      </header>
      <main>
        <div className="info">
          <div>
            <strong>Início</strong>
            <span>
              {`${moment(serviceOrder?.startDate).add(3, 'h').format('DD/MM/YYYY')} - ${moment(serviceOrder?.startTime).format('HH:mm')}`}
            </span>
          </div>
          {serviceOrder?.status === 'CLOSED' && (
            <div>
              <strong>Final</strong>
              <span>
                {`${moment(serviceOrder?.endDate).add(3, 'h').format('DD/MM/YYYY')} - ${moment(serviceOrder?.endTime).format('HH:mm')}`}
              </span>
            </div>
          )}
          <div>
            <strong>Motorista</strong>
            <span>{takeTwoNames(serviceOrder?.driver.name || '')}</span>
          </div>
          <div>
            <strong>Placa</strong>
            <span>{serviceOrder?.truck.plate}</span>
          </div>
          <div>
            <strong>Kilometragem</strong>
            <span>{formatNumber(serviceOrder?.odometer || 0)}</span>
          </div>
          {serviceOrder?.observation && (
            <div className="stretch">
              <strong>Observação</strong>
              <span>
                {serviceOrder?.observation}
              </span>
            </div>
          )}
        </div>
        {serviceOrder?.ServiceOrderService && (
          <div className="activities-info">
            <h3>ATIVIDADES</h3>
            {serviceOrder.ServiceOrderService.map((service) => (
              <div key={service.id} className="card">
                <h4>
                  {service.service.code} - {service.service.name}
                  {service.isEnded && (
                    <Check color="#007F4E" size={20} weight="bold" />
                  )}
                </h4>
                <div className="info">
                  <div>
                    <strong>Início</strong>
                    <span>{moment(service.startTime).format('HH:mm')}</span>
                  </div>
                  <div>
                    <strong>Final</strong>
                    <span>{moment(service.endDate).add(3, 'h').format('DD/MM/YYYY')} - {moment(service.endTime).format('HH:mm')}</span>
                  </div>
                  <div className="stretch">
                    <strong>Executante</strong>
                    <span>{service.executor.name}</span>
                  </div>
                  {service.description && (
                    <div className="stretch">
                      <strong>Descrição</strong>
                      <span>{service.description}</span>
                    </div>
                  )}
                  {service.ServiceOrderServiceMaterial.length > 0 && (
                    <div className="stretch">
                      <strong>Materiais</strong>
                      {service.ServiceOrderServiceMaterial.map((material) => (
                        <span key={material.id}>
                          {material.quantity} UN
                          <strong>
                            {material.material.code} - {material.material.name}
                          </strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer>
        {serviceOrder?.status === 'CLOSED' ? (
          <>
            <Button onClick={exportServiceOrder}>
              <Export size={20} color="#FFFFFF" weight="bold" />
            Exportar
            </Button>
            <Button onClick={() => setChangeNumberModalIsVisible(true)}>
              <Hash size={20} color="#FFFFFF" weight="bold" />
              {serviceOrder?.number ? 'Alterar Número' : 'Inserir Número'}
            </Button>
          </>
        ) : (
          <Button onClick={() => setCloseOrderModalIsVisible(true)}>
            <Check size={20} color="#FFFFFF" weight="bold" />
            Fechar
          </Button>
        )}
      </footer>
    </Container>
  );
}
