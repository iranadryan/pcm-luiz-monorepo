import { NotePencil, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
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
  personId: string | null;
  onClose: (updated: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

const personSchema = z.object({
  id: z.string().nonempty(),
  code: z.number().optional(),
  name: z.string().nonempty(),
  role: z.enum(['DRIVER', 'MECHANIC']),
});

export function EditModal({
  isVisible,
  personId,
  onClose,
  setIsLoading,
}: NewModalProps) {
  const [formData, setFormData] = useState<{
    id: string,
    code: number | null | undefined;
    name: string;
    role: string;
  }>({
    id: '',
    code: undefined,
    name: '',
    role: 'DRIVER',
  });

  function handleChangeData(
    name: keyof typeof formData,
    value: string | number | null | undefined
  ) {
    setFormData((prevState) => {
      const newData = { ...prevState };
      newData[name] = value as never;

      return newData;
    });
  }

  async function handleUpdate() {
    try {
      setIsLoading(true);
      const parsedData = personSchema.safeParse({
        ...formData,
        code: formData.code ? formData.code : undefined,
      });

      if (!parsedData.success) {
        console.log(parsedData.error.issues);
        return setIsLoading(false);
      }

      await trpcClient.person.update.mutate(parsedData.data);
      setIsLoading(false);
      toast({
        type: 'success',
        text: `Produto ${parsedData.data.name} editado com sucesso!`,
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
      if (!personId) {
        return setIsLoading(false);
      }

      const person = await trpcClient.person.find.query(personId);

      setFormData(person);
      setIsLoading(false);
    }

    loadData();
  }, [setIsLoading, personId]);

  return (
    <Modal isVisible={isVisible} onClose={() => onClose(false)}>
      <Container>
        <button onClick={() => onClose(false)} className="close-button">
          <X size={16} color="#343434" weight="bold" />
        </button>
        <InputNumber
          label="Código"
          placeholder="Código"
          value={formData.code}
          onChange={(value) => handleChangeData('code', value)}
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
            { label: 'Motorista', value: 'DRIVER' },
            { label: 'Mecânico', value: 'MECHANIC' },
          ]}
          selected={formData.role}
          onSelect={(value) => handleChangeData('role', value)}
        />
        <Button onClick={handleUpdate} style={{ marginTop: 24 }}>
          <NotePencil size={16} color="#FFFFFF" weight="bold" />
          Editar Pessoa
        </Button>
      </Container>
    </Modal>
  );
}
