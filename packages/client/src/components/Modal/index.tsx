import { ReactPortal } from '../ReactPortal';
import { Title } from '../Title';
import { Container, Overlay } from './styles';

interface ModalProps {
  isVisible: boolean;
  title?: string;
  children: React.ReactNode;
}

export function Modal({
  title,
  children,
  isVisible,
}: ModalProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <ReactPortal containerId="modal-root">
      <Overlay>
        <Container>
          {title && <Title title={title} />}
          {children}
        </Container>
      </Overlay>
    </ReactPortal>
  );
}
