import { Plus, X } from 'phosphor-react';
import { useState } from 'react';
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
  onClose: (updated: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

const productSchema = z.object({
  code: z.number().positive({
    message: 'Código é obrigatório',
  }),
  name: z.string().nonempty({
    message: 'Nome é obrigatório',
  }),
});

export function NewModal({ isVisible, onClose, setIsLoading }: NewModalProps) {
  const [product, setProduct] = useState({
    code: null,
    name: '',
  });

  function handleChangeData(
    name: keyof typeof product,
    value: string | number | null | undefined
  ) {
    setProduct((prevState) => {
      const newData = { ...prevState };
      newData[name] = value as never;

      return newData;
    });
  }

  async function handleCreate() {
    try {
      setIsLoading(true);
      const parsedData = productSchema.safeParse(product);

      if (!parsedData.success) {
        console.log(parsedData.error.issues);
        return setIsLoading(false);
      }

      await trpcClient.product.create.mutate(parsedData.data);
      setIsLoading(false);
      toast({
        type: 'success',
        text: `Produto ${product.name} criado com sucesso!`,
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
          value={product.code}
          onChange={(value) => handleChangeData('code', value)}
        />
        <Input
          label="Nome"
          placeholder="Nome"
          value={product.name}
          onChange={(e) => handleChangeData('name', e.target.value)}
          uppercase
        />
        <Button onClick={handleCreate} style={{ marginTop: 24 }}>
          <Plus size={16} color="#FFFFFF" weight="bold" />
          Criar Produto
        </Button>
      </Container>
    </Modal>
  );
}
