import { Plus, X } from 'phosphor-react';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { InputNumber } from '../../../../components/InputNumber';
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

const personSchema = z.object({
  code: z.number().optional(),
  name: z.string().nonempty(),
  role: z.enum(['DRIVER', 'MECHANIC']),
});

export function NewModal({ isVisible, onClose, setIsLoading }: NewModalProps) {
  const [person, setPerson] = useState<{
    code: number | null | undefined;
    name: string;
    role: string;
  }>({
    code: undefined,
    name: '',
    role: 'DRIVER',
  });

  function handleChangeData(
    name: keyof typeof person,
    value: string | number | null | undefined
  ) {
    setPerson((prevState) => {
      const newData = { ...prevState };
      newData[name] = value as never;

      return newData;
    });
  }

  async function handleCreate() {
    try {
      setIsLoading(true);
      const parsedData = personSchema.safeParse({
        ...person,
        code: person.code ? person.code : undefined,
      });

      if (!parsedData.success) {
        console.log(parsedData.error.issues);
        return setIsLoading(false);
      }

      await trpcClient.person.create.mutate(parsedData.data);
      setIsLoading(false);
      toast({
        type: 'success',
        text: `Pessoa ${parsedData.data.name} criada com sucesso!`,
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
        <InputNumber
          label="Código"
          placeholder="Código"
          value={person.code}
          onChange={(value) => handleChangeData('code', value)}
        />
        <Input
          label="Nome"
          placeholder="Nome"
          value={person.name}
          onChange={(e) => handleChangeData('name', e.target.value)}
          uppercase
        />
        <Select
          label="Tipo"
          isModal
          options={[
            { label: 'Motorista', value: 'DRIVER' },
            { label: 'Mecânico', value: 'MECHANIC' },
          ]}
          selected={person.role}
          onSelect={(value) => handleChangeData('role', value)}
        />
        <Button onClick={handleCreate} style={{ marginTop: 24 }}>
          <Plus size={16} color="#FFFFFF" weight="bold" />
          Criar Pessoa
        </Button>
      </Container>
    </Modal>
  );
}
