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

export function ListServices() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadModalIsVisible, setUploadModalIsVisible] = useState(false);
  const [newModalIsVisible, setNewModalIsVisible] = useState(false);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [serviceToBeDeleted, setServiceToBeDeleted] = useState<string | null>(
    null
  );
  const [editModalIsVisible, setEditModalIsVisible] = useState(false);
  const [serviceToBeUpdated, setServiceToBeUpdated] = useState<string | null>(
    null
  );
  const { headerHeight } = useResponsiveContext();

  const { data: services, refetch } = trpc.service.list.useQuery();

  function handleDeleteService(id: string) {
    setServiceToBeDeleted(id);
    setDeleteModalIsVisible(true);
  }

  function handleUpdateService(id: string) {
    setServiceToBeUpdated(id);
    setEditModalIsVisible(true);
  }

  return (
    <Container headerHeight={headerHeight}>
      <Loader isLoading={!services || isLoading} />
      <ConfirmDeleteModal
        isVisible={deleteModalIsVisible}
        setIsLoading={setIsLoading}
        serviceId={serviceToBeDeleted}
        onClose={(updated) => {
          setDeleteModalIsVisible(false);
          setServiceToBeDeleted(null);

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
        serviceId={serviceToBeUpdated}
        onClose={(updated) => {
          setEditModalIsVisible(false);

          if (updated) {
            refetch();
          }
        }}
      />
      <header>
        <Title title="LISTAGEM DE SERVIÇOS" />
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
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {services && services.map((service) => (
            <tr key={service.id}>
              <td className="align-center">
                <strong>{service.code}</strong>
              </td>
              <td>{service.name}</td>
              <td className="align-center">
                <button onClick={() => handleUpdateService(service.id)}>
                  <NotePencil color="#F37324" size={18} weight="regular" />
                </button>
                <button onClick={() => handleDeleteService(service.id)}>
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
