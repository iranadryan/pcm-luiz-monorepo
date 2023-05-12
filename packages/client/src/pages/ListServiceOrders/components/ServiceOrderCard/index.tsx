import { Container } from './styles';
import { Button } from '../../../../components/Button';
import { ServiceOrder } from 'server/src/types';
import {
  ArrowRight,
  DotsThreeOutlineVertical,
  Gear,
  NotePencil,
} from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { takeTwoNames } from '../../../../utils/takeTwoNames';
import { CardContextMenu } from '../CardContextMenu';
import { useState } from 'react';

interface ServiceOrderCardProps {
  serviceOrder: ServiceOrder;
  onDelete: (id: string) => void;
}

export function ServiceOrderCard({
  serviceOrder: { id, status, number, truck, driver, startDate, endDate },
  onDelete,
}: ServiceOrderCardProps) {
  const [contextMenuIsVisible, setContextMenuIsVisible] = useState(false);
  const navigate = useNavigate();

  return (
    <Container>
      <CardContextMenu
        isVisible={contextMenuIsVisible}
        onClose={() => setContextMenuIsVisible(false)}
        onDelete={() => onDelete(id)}
        serviceOrderId={id}
      />
      <header>
        <div className="icon">
          <Gear color="#007F4E" size={32} weight="duotone" />
        </div>
        <strong>{number ? `#${number}` : 'ORDEM'}</strong>
        {status === 'OPEN' && (
          <small className="open">
            ABERTA
          </small>
        )}
        {status === 'CLOSED' && (
          <small>
            FECHADA
          </small>
        )}
        {status === 'LAUNCHED' && (
          <small className="launched">
            LANÇADA
          </small>
        )}
        <button
          className="context-button"
          onClick={() => setContextMenuIsVisible(true)}
        >
          <DotsThreeOutlineVertical color="#48AF7A" size={20} weight="fill" />
        </button>
      </header>
      <div className="info">
        <div>
          <strong>Placa</strong>
          <span>{truck.plate}</span>
        </div>
        <div>
          <strong>Motorista</strong>
          <span>{takeTwoNames(driver.name)}</span>
        </div>
      </div>
      <div className="dates">
        <span>{moment(startDate).add(3, 'h').format('DD/MM/YYYY')}</span>
        {endDate && (
          <>
            <ArrowRight color="#F37324" size={18} weight="bold" />
            <span>{moment(endDate).add(3, 'h').format('DD/MM/YYYY')}</span>
          </>
        )}
      </div>
      <footer>
        {status === 'OPEN' && (
          <Button
            onClick={() => {
              navigate(`edit/${id}`);
            }}
            secondary
          >
            Editar
            <NotePencil color="#FFFFFF" size={18} weight="bold" />
          </Button>
        )}
        <Button
          onClick={() => {
            navigate(`view/${id}`);
          }}
          secondary
        >
          Visualizar
          <ArrowRight color="#FFFFFF" size={18} weight="bold" />
        </Button>
      </footer>
    </Container>
  );
}
