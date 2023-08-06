import { NotePencil, Plus, Trash, UploadSimple } from 'phosphor-react';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Loader } from '../../components/Loader';
import { Table } from '../../components/Table';
import { Title } from '../../components/Title';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';
import { trpc } from '../../lib/trpc';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { EditModal } from './components/EditModal';
import { NewModal } from './components/NewModal';
import { Container } from './styles';

export function ListUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [newModalIsVisible, setNewModalIsVisible] = useState(false);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [userToBeDeleted, setUserToBeDeleted] = useState<string | null>(
    null
  );
  const [editModalIsVisible, setEditModalIsVisible] = useState(false);
  const [userToBeUpdated, setUserToBeUpdated] = useState<string | null>(
    null
  );
  const { headerHeight } = useResponsiveContext();

  const { data: users, refetch } = trpc.user.list.useQuery();

  function handleDeleteUser(id: string) {
    setUserToBeDeleted(id);
    setDeleteModalIsVisible(true);
  }

  function handleUpdateUser(id: string) {
    setUserToBeUpdated(id);
    setEditModalIsVisible(true);
  }

  return (
    <Container headerHeight={headerHeight}>
      <Loader isLoading={!users || isLoading} />
      <ConfirmDeleteModal
        isVisible={deleteModalIsVisible}
        setIsLoading={setIsLoading}
        userId={userToBeDeleted}
        onClose={(updated) => {
          setDeleteModalIsVisible(false);
          setUserToBeDeleted(null);

          if (updated) {
            refetch();
          }
        }}
      />
      <NewModal
        isVisible={newModalIsVisible}
        setIsLoading={setIsLoading}
        onClose={(updated) => {
          setNewModalIsVisible(false);

          if (updated) {
            refetch();
          }
        }}
      />
      <EditModal
        isVisible={editModalIsVisible}
        setIsLoading={setIsLoading}
        userId={userToBeUpdated}
        onClose={(updated) => {
          setEditModalIsVisible(false);

          if (updated) {
            refetch();
          }
        }}
      />
      <header>
        <Title title="LISTAGEM DE USUÁRIOS" />
        <div className="buttons">
          <Button onClick={() => setNewModalIsVisible(true)} secondary>
            <Plus color="#FFF" size={16} weight="bold" />
            Criar
          </Button>
        </div>
      </header>
      <Table>
        <thead>
          <tr>
            <th>NOME</th>
            <th>USUÁRIO</th>
            <th>PAPEL</th>
            <th>ATIVO</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td className='align-center'>{user.username}</td>
                <td className="align-center">
                  {user.role === 'ADMIN' && 'Administrador'}
                  {user.role === 'ATTENDANT' && 'Frentista'}
                  {user.role === 'DRIVER' && 'Motorista'}
                  {user.role === 'MECHANIC' && 'Mecânico'}
                </td>
                <td className='align-center'>{user.active ? 'Sim' : 'Não'}</td>
                <td className="align-center">
                  <button onClick={() => handleUpdateUser(user.id)}>
                    <NotePencil color="#F37324" size={18} weight="regular" />
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    <Trash color="#E12729" size={18} weight="regular" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
}
