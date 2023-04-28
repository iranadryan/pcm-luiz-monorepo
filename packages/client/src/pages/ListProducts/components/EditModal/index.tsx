import { NotePencil, X } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { InputNumber } from '../../../../components/InputNumber';
import { Modal } from '../../../../components/Modal';
import { trpcClient } from '../../../../lib/trpcClient';
import { toast } from '../../../../utils/toast';
import { Container } from './styled';

interface NewModalProps {
  isVisible: boolean;
  productId: string | null;
  onClose: (updated: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

const productSchema = z.object({
  id: z.string().nonempty(),
  code: z.number().positive({
    message: 'Código é obrigatório',
  }),
  name: z.string().nonempty({
    message: 'Nome é obrigatório',
  }),
});

export function EditModal({
  isVisible,
  productId,
  onClose,
  setIsLoading,
}: NewModalProps) {
  const [formData, setFormData] = useState<{
    id: string,
    code: number | null | undefined,
    name: string,
  }>({
    id: '',
    code: null,
    name: '',
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
      const parsedData = productSchema.safeParse(formData);

      if (!parsedData.success) {
        console.log(parsedData.error.issues);
        return setIsLoading(false);
      }

      await trpcClient.product.update.mutate(parsedData.data);
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
      if (!productId) {
        return setIsLoading(false);
      }

      const product = await trpcClient.product.find.query(productId);

      setFormData(product);
      setIsLoading(false);
    }

    loadData();
  }, [setIsLoading, productId]);

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
        <Button onClick={handleUpdate} style={{ marginTop: 24 }}>
          <NotePencil size={16} color="#FFFFFF" weight="bold" />
          Editar Produto
        </Button>
      </Container>
    </Modal>
  );
}
