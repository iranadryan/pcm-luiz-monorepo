import useAnimatedUnmount from '../../hooks/useAnimatedUnmount';
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
  const { shouldRender, animatedElementRef } = useAnimatedUnmount(isVisible);

  if (!shouldRender) {
    return null;
  }

  return (
    <ReactPortal containerId="modal-root">
      <Overlay ref={animatedElementRef} isLeaving={!isVisible}>
        <Container isLeaving={!isVisible}>
          {title && <Title title={title} />}
          {children}
        </Container>
      </Overlay>
    </ReactPortal>
  );
}
