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
import { UploadModal } from './components/UploadModal';
import { Container } from './styles';

export function ListPeople() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadModalIsVisible, setUploadModalIsVisible] = useState(false);
  const [newModalIsVisible, setNewModalIsVisible] = useState(false);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [personToBeDeleted, setPersonToBeDeleted] = useState<string | null>(
    null
  );
  const [editModalIsVisible, setEditModalIsVisible] = useState(false);
  const [personToBeUpdated, setPersonToBeUpdated] = useState<string | null>(
    null
  );
  const { headerHeight } = useResponsiveContext();

  const { data: person, refetch } = trpc.person.list.useQuery();

  function handleDeletePerson(id: string) {
    setPersonToBeDeleted(id);
    setDeleteModalIsVisible(true);
  }

  function handleUpdatePerson(id: string) {
    setPersonToBeUpdated(id);
    setEditModalIsVisible(true);
  }

  return (
    <Container headerHeight={headerHeight}>
      <Loader isLoading={!person || isLoading} />
      <ConfirmDeleteModal
        isVisible={deleteModalIsVisible}
        setIsLoading={setIsLoading}
        personId={personToBeDeleted}
        onClose={(updated) => {
          setDeleteModalIsVisible(false);
          setPersonToBeDeleted(null);

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
      <UploadModal
        isVisible={uploadModalIsVisible}
        setIsLoading={setIsLoading}
        onClose={(updated) => {
          setUploadModalIsVisible(false);

          if (updated) {
            refetch();
          }
        }}
      />
      <EditModal
        isVisible={editModalIsVisible}
        setIsLoading={setIsLoading}
        personId={personToBeUpdated}
        onClose={(updated) => {
          setEditModalIsVisible(false);

          if (updated) {
            refetch();
          }
        }}
      />
      <header>
        <Title title="LISTAGEM DE PESSOAS" />
        <div className="buttons">
          <Button onClick={() => setNewModalIsVisible(true)} secondary>
            <Plus color="#FFF" size={16} weight="bold" />
            Criar
          </Button>
          <Button onClick={() => setUploadModalIsVisible(true)} secondary>
            <UploadSimple color="#FFF" size={16} weight="bold" />
            Importar
          </Button>
        </div>
      </header>
      <Table>
        <thead>
          <tr>
            <th>CÓDIGO</th>
            <th>NOME</th>
            <th>PAPEL</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {person &&
            person.map((person) => (
              <tr key={person.id}>
                <td className="align-center">
                  <strong>{person.code}</strong>
                </td>
                <td>{person.name}</td>
                <td className="align-center">
                  {person.role === 'DRIVER' ? 'Motorista' : 'Mecânico'}
                </td>
                <td className="align-center">
                  <button onClick={() => handleUpdatePerson(person.id)}>
                    <NotePencil color="#F37324" size={18} weight="regular" />
                  </button>
                  <button onClick={() => handleDeletePerson(person.id)}>
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
