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

export function ListProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadModalIsVisible, setUploadModalIsVisible] = useState(false);
  const [newModalIsVisible, setNewModalIsVisible] = useState(false);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [productToBeDeleted, setProductToBeDeleted] = useState<string | null>(
    null
  );
  const [editModalIsVisible, setEditModalIsVisible] = useState(false);
  const [productToBeUpdated, setProductToBeUpdated] = useState<string | null>(
    null
  );
  const { headerHeight } = useResponsiveContext();

  const { data: products, refetch } = trpc.product.list.useQuery();

  function handleDeleteProduct(id: string) {
    setProductToBeDeleted(id);
    setDeleteModalIsVisible(true);
  }

  function handleUpdateProduct(id: string) {
    setProductToBeUpdated(id);
    setEditModalIsVisible(true);
  }

  return (
    <Container headerHeight={headerHeight}>
      <Loader isLoading={!products || isLoading} />
      <ConfirmDeleteModal
        isVisible={deleteModalIsVisible}
        setIsLoading={setIsLoading}
        productId={productToBeDeleted}
        onClose={(updated) => {
          setDeleteModalIsVisible(false);
          setProductToBeDeleted(null);

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
        productId={productToBeUpdated}
        onClose={(updated) => {
          setEditModalIsVisible(false);

          if (updated) {
            refetch();
          }
        }}
      />
      <header>
        <Title title="LISTAGEM DE PRODUTOS" />
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
          {products &&
            products.map((product) => (
              <tr key={product.id}>
                <td className="align-center">
                  <strong>{product.code}</strong>
                </td>
                <td>{product.name}</td>
                <td className="align-center">
                  <button onClick={() => handleUpdateProduct(product.id)}>
                    <NotePencil color="#F37324" size={18} weight="regular" />
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)}>
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
