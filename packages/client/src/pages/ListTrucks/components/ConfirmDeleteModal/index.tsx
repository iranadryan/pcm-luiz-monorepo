import { Trash } from 'phosphor-react';
import { Button } from '../../../../components/Button';
import { Modal } from '../../../../components/Modal';
import { trpcClient } from '../../../../lib/trpcClient';
import { toast } from '../../../../utils/toast';
import { Container } from './styles';

interface ConfirmDeleteModalProps {
  isVisible: boolean;
  onClose: (updated: boolean) => void;
  setIsLoading: (value: boolean) => void;
  truckId: string | null;
}

export function ConfirmDeleteModal({
  isVisible,
  truckId,
  onClose,
  setIsLoading,
}: ConfirmDeleteModalProps) {
  async function handleDelete() {
    try {
      if (truckId) {
        setIsLoading(true);
        await trpcClient.truck.delete.mutate(truckId);
        toast({
          type: 'success',
          text: 'Placa deletada com sucesso!',
        });
      }

      onClose(true);
      setIsLoading(false);
    } catch (error: any) {
      toast({
        type: 'danger',
        text: error.message,
      });
      setIsLoading(false);
      onClose(false);
    }
  }
  return (
    <Modal
      isVisible={isVisible}
      title="DESEJA DELETAR ESTA ORDEM?"
      onClose={() => onClose(false)}
    >
      <Container>
        <p>
          Tem certeza que quer deletar esta placa? Uma vez feita, a ação é
          irreversível!
        </p>
        <footer>
          <Button onClick={() => onClose(false)} tertiary>
            Cancelar
          </Button>
          <Button onClick={handleDelete} danger>
            <Trash size={20} color="#FFFFFF" weight="bold" />
            Deletar
          </Button>
        </footer>
      </Container>
    </Modal>
  );
}
