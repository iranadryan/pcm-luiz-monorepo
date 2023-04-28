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

export function UploadModal({
  isVisible,
  onClose,
  setIsLoading,
}: UploadTrucksModalProps) {
  const [personRole, setPersonRole] = useState<'DRIVER' | 'MECHANIC'>('DRIVER');

  const { mutateAsync } = trpc.person.bulkCreate.useMutation();

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

    const parsedData = personRole === 'DRIVER' ? rows.map((row) => ({
      name: String(row[0]),
      role: personRole,
    })) : rows.map((row) => ({
      code: Number(row[0]),
      name: String(row[1]),
      role: personRole,
    }));

    await mutateAsync({
      role: personRole,
      people: parsedData
    });
    toast({
      type: 'success',
      text: `${parsedData.length} Pessoas adicionadas`
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
            { label: 'Motorista', value: 'DRIVER' },
            { label: 'Mecânico', value: 'MECHANIC' },
          ]}
          selected={personRole}
          onSelect={(value) =>
            setPersonRole(value === 'DRIVER' ? 'DRIVER' : 'MECHANIC')
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
          Importar Pessoas
        </Button>
      </Container>
    </Modal>
  );
}
