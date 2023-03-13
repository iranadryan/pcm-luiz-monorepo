import { Plus, X } from 'phosphor-react';
import { useEffect, useMemo, useState } from 'react';
import { Material } from '../..';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Modal } from '../../../../components/Modal';
import { Option, Select } from '../../../../components/Select';
import { Container } from './styles';

interface AddMaterialModalProps {
  isVisible: boolean;
  closeModal: () => void;
  activityId: string | null;
  materialOptions: Option[];
  materialUnits: {
    id: string;
    unit: string;
  }[];
  onAddMaterial: (activityId: string, material: Material) => void;
}

export function AddMaterialModal({
  materialOptions,
  materialUnits,
  isVisible,
  activityId,
  closeModal,
  onAddMaterial
}: AddMaterialModalProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('');
  const selectedMaterialUnit = useMemo(() => materialUnits.find(
    ({ id }) => id === selectedMaterial
  )?.unit || null, [materialUnits, selectedMaterial]);

  useEffect(() => {
    setSelectedMaterial(null);
    setQuantity('');
  }, []);

  function handleAddMaterial() {
    if (
      !activityId ||
      !selectedMaterial ||
      !selectedMaterialUnit ||
      quantity === ''
    ) {
      return;
    }

    onAddMaterial(activityId, {
      id: selectedMaterial,
      name: materialOptions.find(({ value }) => value === selectedMaterial)?.label || '',
      unit: selectedMaterialUnit,
      quantity,
    });

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
        />
        <div className="qty-input">
          <Input
            label="Quantidade"
            placeholder="Insira a quantidade utilizada"
            type="number"
            value={quantity}
            min={0}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {selectedMaterialUnit && <span>{selectedMaterialUnit}</span>}
        </div>
        <Button onClick={handleAddMaterial} style={{ marginTop: 24 }}>
          <Plus size={16} color="#FFFFFF" weight="bold" />
          Adicionar
        </Button>
      </Container>
    </Modal>
  );
}
