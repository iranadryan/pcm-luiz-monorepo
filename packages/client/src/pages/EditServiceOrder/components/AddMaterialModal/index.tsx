import { v4 as uuidv4 } from 'uuid';
import { Plus, X } from 'phosphor-react';
import { useMemo, useState } from 'react';
import { Material } from '../..';
import { Button } from '../../../../components/Button';
import { InputNumber } from '../../../../components/InputNumber';
import { Modal } from '../../../../components/Modal';
import { Option, Select } from '../../../../components/Select';
import { Container } from './styles';

interface AddMaterialModalProps {
  isVisible: boolean;
  closeModal: () => void;
  serviceId: string | null;
  materialOptions: Option[];
  materialUnits: {
    id: string;
    unit: string;
  }[];
  onAddMaterial: (serviceId: string, material: Material) => void;
}

export function AddMaterialModal({
  materialOptions,
  materialUnits,
  isVisible,
  serviceId,
  closeModal,
  onAddMaterial
}: AddMaterialModalProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | null | undefined>(null);
  const selectedMaterialUnit = useMemo(() => materialUnits.find(
    ({ id }) => id === selectedMaterial
  )?.unit || null, [materialUnits, selectedMaterial]);

  function handleAddMaterial() {
    if (
      !serviceId ||
      !selectedMaterial ||
      !selectedMaterialUnit ||
      quantity === null ||
      quantity === undefined ||
      quantity === 0
    ) {
      return;
    }

    onAddMaterial(serviceId, {
      id: uuidv4(),
      materialId: selectedMaterial,
      deleted: false,
      alreadyExists: false,
      name: materialOptions.find(
        ({ value }) => value === selectedMaterial
      )?.label || '',
      unit: selectedMaterialUnit,
      quantity,
    });

    setSelectedMaterial(null);
    setQuantity(null);
    closeModal();
  }

  return (
    <Modal isVisible={isVisible}>
      <Container>
        <button onClick={closeModal} className="close-button">
          <X size={16} color="#343434" weight="bold" />
        </button>
        <Select
          label="Material"
          placeholder="Selecione um material"
          options={materialOptions}
          selected={selectedMaterial}
          onSelect={setSelectedMaterial}
          isModal
          filter
          emptyMessage="Nenhum material encontrado"
        />
        <div className="qty-input">
          <InputNumber
            label="Quantidade"
            placeholder="Insira a quantidade utilizada"
            value={quantity}
            onChange={setQuantity}
          />
          {selectedMaterialUnit && (
            <span className="unit">{selectedMaterialUnit}</span>
          )}
        </div>
        <Button onClick={handleAddMaterial} style={{ marginTop: 24 }}>
          <Plus size={16} color="#FFFFFF" weight="bold" />
          Adicionar
        </Button>
      </Container>
    </Modal>
  );
}
