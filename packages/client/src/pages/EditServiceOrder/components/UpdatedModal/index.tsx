import { House } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/Button';
import { Modal } from '../../../../components/Modal';
import { Container } from './styles';

interface CreatedModalProps {
  isVisible: boolean
}

export function UpdatedModal({ isVisible }: CreatedModalProps) {
  const navigate = useNavigate();

  return (
    <Modal isVisible={isVisible} title="ORDEM DE SERVIÇO EDITADA">
      <Container>
        <p>Sua ordem de serviço foi editada com sucesso</p>
        <Button onClick={() => navigate('/')} style={{ marginTop: 24 }}>
          <House size={20} color="#FFFFFF" weight="bold" />
          Ir para tela inicial
        </Button>
      </Container>
    </Modal>
  );
}
