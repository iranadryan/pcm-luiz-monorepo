import { NotePencil, X } from 'phosphor-react';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Modal } from '../../../../components/Modal';
import { Option, Select } from '../../../../components/Select';
import { trpcClient } from '../../../../lib/trpcClient';
import { toast } from '../../../../utils/toast';
import { Container } from './styled';
import { trpc } from '../../../../lib/trpc';
import { generateUsername } from '../../../../utils/generateUsername';
import { Checkbox } from '../../../../components/Checkbox';

interface NewModalProps {
  isVisible: boolean;
  userId: string | null;
  onClose: (updated: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

const userSchema = z.object({
  id: z.string().uuid().nonempty(),
  name: z.string().trim().nonempty({
    message: 'Nome é obrigatório',
  }),
  username: z
    .string()
    .trim()
    .min(4, {
      message: 'Nome de usuário deve ter pelo menos 4 caracteres',
    })
    .refine(
      (value) => !/ /.test(value),
      'Nome de usuário não pode conter espaços',
    ),
  password: z.string().trim().min(4, {
    message: 'Senha deve ter pelo menos 4 caracteres',
  }),
  personId: z.string().uuid().nullable(),
  active: z.boolean(),
  role: z.enum(['ADMIN', 'DRIVER', 'MECHANIC', 'ATTENDANT']),
});

export function EditModal({
  isVisible,
  userId,
  onClose,
  setIsLoading,
}: NewModalProps) {
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    username: string;
    password: string;
    personId: string | null;
    active: boolean;
    role: string;
  }>({
    id: '',
    name: '',
    username: '',
    password: '',
    personId: null,
    active: false,
    role: '',
  });

  const { data: people } = trpc.person.list.useQuery();
  const peopleOptions: Option[] = useMemo<Option[]>(
    () =>
      !people
        ? []
        : people.map((person) => ({ label: person.name, value: person.id })),
    [people],
  );

  function handleChangeData(
    name: keyof typeof formData,
    value: string | number | null | undefined | boolean,
  ) {
    setFormData((prevState) => {
      const newData = { ...prevState };
      newData[name] = value as never;

      return newData;
    });
  }

  function handleChangePerson(personId: string) {
    const person = people?.find((person) => person.id === personId);

    handleChangeData('personId', personId);
    handleChangeData('name', person?.name);
    handleChangeData('username', generateUsername(person?.name || ''));
    handleChangeData('role', person?.role);
  }

  async function handleUpdate() {
    try {
      setIsLoading(true);
      const parsedData = userSchema.safeParse(formData);

      if (!parsedData.success) {
        parsedData.error.issues.forEach((issue) => {
          toast({
            type: 'danger',
            text: issue.message,
          });
        });
        return setIsLoading(false);
      }

      await trpcClient.user.update.mutate(parsedData.data);
      setIsLoading(false);
      toast({
        type: 'success',
        text: `Usuário ${parsedData.data.username} editado com sucesso!`,
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
      if (!userId) {
        return setIsLoading(false);
      }

      const user = await trpcClient.user.find.query(userId);

      setFormData({ ...user, password: '' });
      setIsLoading(false);
    }

    loadData();
  }, [setIsLoading, userId]);

  return (
    <Modal isVisible={isVisible} onClose={() => onClose(false)}>
      <Container>
        <button onClick={() => onClose(false)} className="close-button">
          <X size={16} color="#343434" weight="bold" />
        </button>
        <Select
          label="Pessoa"
          placeholder="Pessoa"
          emptyMessage="Nenhuma pessoa encontrada"
          isModal
          options={peopleOptions}
          selected={formData.personId}
          onSelect={(value) => handleChangePerson(value)}
        />
        {!formData.personId && (
          <Input
            label="Nome"
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => handleChangeData('name', e.target.value)}
            uppercase
          />
        )}
        <Input
          label="Usuário"
          placeholder="Nome de usuário"
          value={formData.username}
          onChange={(e) => handleChangeData('username', e.target.value)}
          uppercase
        />
        <Input
          label="Senha"
          placeholder="Uma senha forte"
          value={formData.password}
          onChange={(e) => handleChangeData('password', e.target.value)}
          password
        />
        <Select
          label="Papel"
          isModal
          options={[
            { label: 'Administrador', value: 'ADMIN' },
            { label: 'Frentista', value: 'ATTENDANT' },
            { label: 'Motorista', value: 'DRIVER' },
            { label: 'Mecânico', value: 'MECHANIC' },
          ]}
          selected={formData.role}
          onSelect={(value) => handleChangeData('role', value)}
        />
        <Checkbox
          label="Ativo"
          name="active"
          checked={formData.active}
          onCheck={() => handleChangeData('active', !formData.active)}
          style={{ marginTop: 12 }}
        />
        <Button onClick={handleUpdate} style={{ marginTop: 24 }}>
          <NotePencil size={16} color="#FFFFFF" weight="bold" />
          Editar Usuário
        </Button>
      </Container>
    </Modal>
  );
}
