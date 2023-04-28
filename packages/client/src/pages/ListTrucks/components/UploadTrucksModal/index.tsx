import { Plus, X } from 'phosphor-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import readXlsxFile from 'read-excel-file';
import { Button } from '../../../../components/Button';
import { Modal } from '../../../../components/Modal';
import { Select } from '../../../../components/Select';
import { trpc } from '../../../../lib/trpc';
import { toast } from '../../../../utils/toast';
import { Container } from './styled';

interface UploadTrucksModalProps {
  isVisible: boolean;
  onClose: (updated: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

export function UploadTrucksModal({
  isVisible,
  onClose,
  setIsLoading,
}: UploadTrucksModalProps) {
  const [truckType, setTruckType] = useState<'TRACTOR_UNIT' | 'SEMI_TRAILER'>(
    'TRACTOR_UNIT'
  );

  const { mutateAsync } = trpc.truck.bulkCreate.useMutation();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    noKeyboard: true,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    maxFiles: 1,
    multiple: false,
  });

  async function handleSubmit() {
    if (!acceptedFiles[0]) {
      return;
    }

    setIsLoading(true);

    const rows = await readXlsxFile(acceptedFiles[0]);

    const parsedData = rows.map((row) => ({
      name: row[0]
        ? String(row[0])
        : truckType === 'TRACTOR_UNIT'
          ? 'CAVALO  '
          : 'IMPLEMENTO',
      plate: String(row[1]),
      type: truckType,
    }));

    await mutateAsync(parsedData);
    toast({
      type: 'success',
      text: `${parsedData.length} Placas adicionadas`
    });
    setIsLoading(false);
    onClose(true);
  }

  return (
    <Modal isVisible={isVisible}>
      <Container>
        <button onClick={() => onClose(false)} className="close-button">
          <X size={16} color="#343434" weight="bold" />
        </button>
        <Select
          label="Tipo"
          isModal
          options={[
            { label: 'Cavalo', value: 'TRACTOR_UNIT' },
            { label: 'Implemento', value: 'SEMI_TRAILER' },
          ]}
          selected={truckType}
          onSelect={(value) =>
            setTruckType(
              value === 'TRACTOR_UNIT' ? 'TRACTOR_UNIT' : 'SEMI_TRAILER'
            )
          }
        />
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {acceptedFiles[0] ? (
            <p>{acceptedFiles[0].name}</p>
          ) : (
            <>
              <p className="placeholder">
                Arraste ou clique para selecionar um arquivo
              </p>
              <em>Somente arquivos .xls e .xlsx serão aceitos</em>
            </>
          )}
        </div>
        <Button onClick={handleSubmit} style={{ marginTop: 24 }}>
          <Plus size={16} color="#FFFFFF" weight="bold" />
          Importar Placas
        </Button>
      </Container>
    </Modal>
  );
}
