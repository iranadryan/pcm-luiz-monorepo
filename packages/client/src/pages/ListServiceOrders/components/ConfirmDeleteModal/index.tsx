import { Trash } from 'phosphor-react';
import { Button } from '../../../../components/Button';
import { Modal } from '../../../../components/Modal';
import { trpc } from '../../../../lib/trpc';
import { Container } from './styles';

interface ConfirmDeleteModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
  setIsLoading: (value: boolean) => void;
  orderId: string | null;
}

export function ConfirmDeleteModal({
  isVisible,
  orderId,
  onClose,
  onDelete,
  setIsLoading
}: ConfirmDeleteModalProps) {
  const { mutateAsync } = trpc.serviceOrder.delete.useMutation();

  async function handleDeleteServiceOrder() {
    if (orderId) {
      setIsLoading(true);
      await mutateAsync(orderId);
    }

    onClose();
    onDelete();
    setIsLoading(false);
  }
  return (
    <Modal isVisible={isVisible} title="DESEJA DELETAR ESTA ORDEM?">
      <Container>
        <p>
          Tem certeza que quer deletar esta ordem de serviço? Uma vez feita, a
          ação é irreversível!
        </p>
        <footer>
          <Button onClick={onClose} tertiary>Cancelar</Button>
          <Button onClick={handleDeleteServiceOrder} danger>
            <Trash size={20} color="#FFFFFF" weight="bold" />
            Deletar
          </Button>
        </footer>
      </Container>
    </Modal>
  );
}
