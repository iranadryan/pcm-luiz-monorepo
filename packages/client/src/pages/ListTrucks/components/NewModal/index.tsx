import { Plus, X } from 'phosphor-react';
import { useState } from 'react';
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
  onClose: (updated: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

const truckSchema = z.object({
  plate: z.string().nonempty({
    message: 'Placa é obrigatório',
  }),
  name: z.string().nonempty({
    message: 'Nome é obrigatório',
  }),
  type: z.enum(['TRACTOR_UNIT', 'SEMI_TRAILER']),
});

export function NewModal({ isVisible, onClose, setIsLoading }: NewModalProps) {
  const [truck, setTruck] = useState({
    plate: '',
    name: '',
    type: 'TRACTOR_UNIT',
  });

  function handleChangeData(name: keyof typeof truck, value: string) {
    setTruck((prevState) => {
      const newData = { ...prevState };
      newData[name] = value;

      return newData;
    });
  }

  async function handleCreate() {
    try {
      setIsLoading(true);
      const parsedData = truckSchema.safeParse(truck);

      if (!parsedData.success) {
        console.log(parsedData.error.issues);
        return setIsLoading(false);
      }

      await trpcClient.truck.create.mutate(parsedData.data);
      setIsLoading(false);
      toast({
        type: 'success',
        text: `Placa ${parsedData.data.plate} criada com sucesso!`,
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

  return (
    <Modal isVisible={isVisible} onClose={() => onClose(false)}>
      <Container>
        <button onClick={() => onClose(false)} className="close-button">
          <X size={16} color="#343434" weight="bold" />
        </button>
        <Input
          label="Placa"
          placeholder="Placa"
          value={truck.plate}
          onChange={(e) => handleChangeData('plate', e.target.value)}
          uppercase
        />
        <Input
          label="Nome"
          placeholder="Nome"
          value={truck.name}
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
          selected={truck.type}
          onSelect={(value) => handleChangeData('type', value)}
        />
        <Button onClick={handleCreate} style={{ marginTop: 24 }}>
          <Plus size={16} color="#FFFFFF" weight="bold" />
          Criar Placa
        </Button>
      </Container>
    </Modal>
  );
}
