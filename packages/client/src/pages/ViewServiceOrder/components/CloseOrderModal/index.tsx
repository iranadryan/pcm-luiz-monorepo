import moment from 'moment';
import { Check } from 'phosphor-react';
import { useState } from 'react';
import { Button } from '../../../../components/Button';
import { DateInput } from '../../../../components/DateInput';
import { Input } from '../../../../components/Input';
import { Modal } from '../../../../components/Modal';
import { TimeInput } from '../../../../components/TimeInput';
import { Container } from './styles';

interface CloseOrderModalProps {
  isVisible: boolean;
  closeModal: () => void;
}

export function CloseOrderModal({
  isVisible,
  closeModal
}: CloseOrderModalProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [endDate, setEndDate] = useState(moment().format('DDMMYYYY'));
  const [endTime, setEndTime] = useState(moment().format('HHmm'));

  return (
    <Modal isVisible={isVisible}>
      <Container>
        <Input
          label="Número da OS"
          placeholder="Insira o número da OS"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
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
        <Button onClick={closeModal} style={{ marginTop: 24 }}>
          Fechar
          <Check size={20} color="#FFFFFF" weight="bold" />
        </Button>
      </Container>
    </Modal>
  );
}
