import { Plus, X } from 'phosphor-react';
import { useMemo, useState } from 'react';
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

interface NewModalProps {
  isVisible: boolean;
  onClose: (updated: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

const personSchema = z.object({
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
  role: z.enum(['ADMIN', 'DRIVER', 'MECHANIC', 'ATTENDANT']),
});

export function NewModal({ isVisible, onClose, setIsLoading }: NewModalProps) {
  const [user, setUser] = useState<{
    name: string;
    username: string;
    password: string;
    personId: string | null;
    role: string;
  }>({
    name: '',
    username: '',
    password: '',
    personId: null,
    role: 'ATTENDANT',
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
    name: keyof typeof user,
    value: string | number | null | undefined,
  ) {
    setUser((prevState) => {
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

  async function handleCreate() {
    try {
      setIsLoading(true);
      const parsedData = personSchema.safeParse(user);

      if (!parsedData.success) {
        parsedData.error.issues.forEach((issue) => {
          toast({
            type: 'danger',
            text: issue.message,
          });
        });
        return setIsLoading(false);
      }

      await trpcClient.user.create.mutate(parsedData.data);

      setIsLoading(false);
      toast({
        type: 'success',
        text: `Usuário ${parsedData.data.username} criado com sucesso!`,
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
        <Select
          label="Pessoa"
          placeholder="Pessoa"
          emptyMessage="Nenhuma pessoa encontrada"
          isModal
          options={peopleOptions}
          selected={user.personId}
          onSelect={(value) => handleChangePerson(value)}
        />
        {!user.personId && (
          <Input
            label="Nome"
            placeholder="Nome"
            value={user.name}
            onChange={(e) => handleChangeData('name', e.target.value)}
            uppercase
          />
        )}
        <Input
          label="Usuário"
          placeholder="Nome de usuário"
          value={user.username}
          onChange={(e) => handleChangeData('username', e.target.value)}
          uppercase
        />
        <Input
          label="Senha"
          placeholder="Uma senha forte"
          value={user.password}
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
          selected={user.role}
          onSelect={(value) => handleChangeData('role', value)}
        />
        <Button onClick={handleCreate} style={{ marginTop: 24 }}>
          <Plus size={16} color="#FFFFFF" weight="bold" />
          Criar Usuário
        </Button>
      </Container>
    </Modal>
  );
}
