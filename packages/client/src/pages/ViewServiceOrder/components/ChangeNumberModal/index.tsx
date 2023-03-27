import { Check, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { Button } from '../../../../components/Button';
import { InputNumber } from '../../../../components/InputNumber';
import { Modal } from '../../../../components/Modal';
import { trpc } from '../../../../lib/trpc';
import { Container } from './styles';

interface ChangeNumberModalProps {
  isVisible: boolean;
  closeModal: (closed: boolean) => void;
  serviceOrderId: string;
  onIsLoading: (value: boolean) => void;
  number: number | null;
}

export function ChangeNumberModal({
  isVisible,
  closeModal,
  serviceOrderId,
  onIsLoading,
  number
}: ChangeNumberModalProps) {
  const [orderNumber, setOrderNumber] = useState<number | null | undefined>(
    number
  );

  const changeNumberMutation = trpc.serviceOrder.changeNumber.useMutation();

  useEffect(() => {
    setOrderNumber(number);
  }, [number]);

  async function handleCloseServiceOrder() {
    onIsLoading(true);

    if (!orderNumber) {
      return;
    }

    await changeNumberMutation.mutateAsync({
      id: serviceOrderId,
      number: orderNumber,
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
        <Button onClick={handleCloseServiceOrder} style={{ marginTop: 24 }}>
          {number ? 'Alterar Número' : 'Inserir Número'}
          <Check size={20} color="#FFFFFF" weight="bold" />
        </Button>
      </Container>
    </Modal>
  );
}
