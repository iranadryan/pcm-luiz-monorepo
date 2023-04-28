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
import { UploadTrucksModal } from './components/UploadTrucksModal';
import { Container } from './styles';

export function ListTrucks() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadModalIsVisible, setUploadModalIsVisible] = useState(false);
  const [newModalIsVisible, setNewModalIsVisible] = useState(false);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [truckToBeDeleted, setTruckToBeDeleted] = useState<string | null>(null);
  const [editModalIsVisible, setEditModalIsVisible] = useState(false);
  const [truckToBeUpdated, setTruckToBeUpdated] = useState<string | null>(null);
  const { headerHeight } = useResponsiveContext();

  const { data: trucks, refetch } = trpc.truck.list.useQuery();

  function handleDeleteTruck(id: string) {
    setTruckToBeDeleted(id);
    setDeleteModalIsVisible(true);
  }

  function handleUpdateTruck(id: string) {
    setTruckToBeUpdated(id);
    setEditModalIsVisible(true);
  }

  return (
    <Container headerHeight={headerHeight}>
      <Loader isLoading={!trucks || isLoading} />
      <ConfirmDeleteModal
        isVisible={deleteModalIsVisible}
        setIsLoading={setIsLoading}
        truckId={truckToBeDeleted}
        onClose={(updated) => {
          setDeleteModalIsVisible(false);
          setTruckToBeDeleted(null);

          if (updated) {
            refetch();
          }
        }}
      />
      <UploadTrucksModal
        isVisible={uploadModalIsVisible}
        setIsLoading={setIsLoading}
        onClose={(updated) => {
          setUploadModalIsVisible(false);

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
        truckId={truckToBeUpdated}
        onClose={(updated) => {
          setEditModalIsVisible(false);

          if (updated) {
            refetch();
          }
        }}
      />
      <header>
        <Title title="LISTAGEM DE PLACAS" />
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
            <th>PLACA</th>
            <th>NOME</th>
            <th>TIPO</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {trucks && trucks.map((truck) => (
            <tr key={truck.id}>
              <td className="align-center">
                <strong>{truck.plate}</strong>
              </td>
              <td>{truck.name}</td>
              <td className="align-center">
                {truck.type === 'TRACTOR_UNIT' ? 'Cavalo' : 'Implemento'}
              </td>
              <td className="align-center">
                <button onClick={() => handleUpdateTruck(truck.id)}>
                  <NotePencil color="#F37324" size={18} weight="regular" />
                </button>
                <button onClick={() => handleDeleteTruck(truck.id)}>
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
