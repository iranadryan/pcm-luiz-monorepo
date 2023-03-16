import moment from 'moment';
import { Check, X } from 'phosphor-react';
import { useState } from 'react';
import { Button } from '../../../../components/Button';
import { DateInput } from '../../../../components/DateInput';
import { InputNumber } from '../../../../components/InputNumber';
import { Modal } from '../../../../components/Modal';
import { TimeInput } from '../../../../components/TimeInput';
import { trpc } from '../../../../lib/trpc';
import { Container } from './styles';

interface CloseOrderModalProps {
  isVisible: boolean;
  closeModal: (closed: boolean) => void;
  serviceOrderId: string;
  onIsLoading: (value: boolean) => void;
}

export function CloseOrderModal({
  isVisible,
  closeModal,
  serviceOrderId,
  onIsLoading
}: CloseOrderModalProps) {
  const [orderNumber, setOrderNumber] = useState<number | null | undefined>(
    null
  );
  const [endDate, setEndDate] = useState(moment().format('DDMMYYYY'));
  const [endTime, setEndTime] = useState(moment().format('HHmm'));

  const closeServiceOrderMutation = trpc.serviceOrder.close.useMutation();

  async function handleCloseServiceOrder() {
    onIsLoading(true);

    if (!orderNumber) {
      return;
    }

    await closeServiceOrderMutation.mutateAsync({
      id: serviceOrderId,
      number: orderNumber,
      endDate: moment(endDate, 'DDMMYYYY').toDate(),
      endTime: moment(endTime, 'HHmm').toDate(),
    });

    onIsLoading(false);
    closeModal(true);
  }

  return (
    <Modal isVisible={isVisible}>
      <Container>
        <button onClick={() => closeModal(false)} className="close-button">
          <X size={16} color="#343434" weight="bold" />
        </button>
        <InputNumber
          label="Número da OS"
          placeholder="Insira o número da OS"
          value={orderNumber}
          onChange={setOrderNumber}
        />
        <div className="date-input">
          <DateInput
            label="Data Final"
            placeholder="Data Final"
            value={endDate}
            onChange={setEndDate}
          />
          <TimeInput
            label="Hora Final"
            placeholder="Hora Final"
            value={endTime}
            onChange={setEndTime}
          />
        </div>
        <Button onClick={handleCloseServiceOrder} style={{ marginTop: 24 }}>
          Fechar
          <Check size={20} color="#FFFFFF" weight="bold" />
        </Button>
      </Container>
    </Modal>
  );
}
