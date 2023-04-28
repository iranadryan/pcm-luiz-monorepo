import { NotePencil, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Modal } from '../../../../components/Modal';
import { Select } from '../../../../components/Select';
import { trpcClient } from '../../../../lib/trpcClient';
import { toast } from '../../../../utils/toast';
import { Container } from './styled';

interface NewModalProps {
  isVisible: boolean;
  truckId: string | null;
  onClose: (updated: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

const truckSchema = z.object({
  id: z.string().nonempty(),
  plate: z.string().nonempty({
    message: 'Placa é obrigatório',
  }),
  name: z.string().nonempty({
    message: 'Nome é obrigatório',
  }),
  type: z.enum(['TRACTOR_UNIT', 'SEMI_TRAILER']),
});

export function EditModal({
  isVisible,
  truckId,
  onClose,
  setIsLoading,
}: NewModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    plate: '',
    name: '',
    type: 'TRACTOR_UNIT',
  });

  function handleChangeData(name: keyof typeof formData, value: string) {
    setFormData((prevState) => {
      const newData = { ...prevState };
      newData[name] = value;

      return newData;
    });
  }

  async function handleUpdate() {
    try {
      setIsLoading(true);
      const parsedData = truckSchema.safeParse(formData);

      if (!parsedData.success) {
        console.log(parsedData.error.issues);
        return setIsLoading(false);
      }

      await trpcClient.truck.update.mutate(parsedData.data);
      setIsLoading(false);
      toast({
        type: 'success',
        text: `Placa ${parsedData.data.plate} editada com sucesso!`,
      });
      onClose(true);
    } catch (error: any) {
      toast({
        type: 'danger',
        text: error.message,
      });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      if (!truckId) {
        return setIsLoading(false);
      }

      const truck = await trpcClient.truck.find.query(truckId);

      setFormData(truck);
      setIsLoading(false);
    }

    loadData();
  }, [setIsLoading, truckId]);

  return (
    <Modal isVisible={isVisible} onClose={() => onClose(false)}>
      <Container>
        <button onClick={() => onClose(false)} className="close-button">
          <X size={16} color="#343434" weight="bold" />
        </button>
        <Input
          label="Placa"
          placeholder="Placa"
          value={formData.plate}
          onChange={(e) => handleChangeData('plate', e.target.value)}
          uppercase
        />
        <Input
          label="Nome"
          placeholder="Nome"
          value={formData.name}
          onChange={(e) => handleChangeData('name', e.target.value)}
          uppercase
        />
        <Select
          label="Tipo"
          isModal
          options={[
            { label: 'Cavalo', value: 'TRACTOR_UNIT' },
            { label: 'Implemento', value: 'SEMI_TRAILER' },
          ]}
          selected={formData.type}
          onSelect={(value) => handleChangeData('type', value)}
        />
        <Button onClick={handleUpdate} style={{ marginTop: 24 }}>
          <NotePencil size={16} color="#FFFFFF" weight="bold" />
          Editar Placa
        </Button>
      </Container>
    </Modal>
  );
}
