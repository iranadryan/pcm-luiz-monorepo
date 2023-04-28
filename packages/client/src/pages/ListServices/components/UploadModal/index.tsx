import { Plus, X } from 'phosphor-react';
import { useDropzone } from 'react-dropzone';
import readXlsxFile from 'read-excel-file';
import { Button } from '../../../../components/Button';
import { Modal } from '../../../../components/Modal';
import { trpc } from '../../../../lib/trpc';
import { toast } from '../../../../utils/toast';
import { Container } from './styled';

interface UploadModalProps {
  isVisible: boolean;
  onClose: (updated: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

export function UploadModal({
  isVisible,
  onClose,
  setIsLoading,
}: UploadModalProps) {
  const { mutateAsync } = trpc.service.bulkCreate.useMutation();

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
      code: Number(row[0]),
      name: String(row[1]),
    }));

    await mutateAsync(parsedData);
    toast({
      type: 'success',
      text: `${parsedData.length} Serviços adicionados`
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
          Criar Placa
        </Button>
      </Container>
    </Modal>
  );
}
