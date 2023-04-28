import { useEffect } from 'react';
import useAnimatedUnmount from '../../hooks/useAnimatedUnmount';
import { ReactPortal } from '../ReactPortal';
import { Title } from '../Title';
import { Container, Overlay } from './styles';

interface ModalProps {
  isVisible: boolean;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export function Modal({
  title,
  children,
  isVisible,
  onClose,
}: ModalProps) {
  const { shouldRender, animatedElementRef } = useAnimatedUnmount(isVisible);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        if (onClose) {
          onClose();
        }
      }
    }

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

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
