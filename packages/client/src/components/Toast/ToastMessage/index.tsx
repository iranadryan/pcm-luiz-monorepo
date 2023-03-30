import { useEffect, memo } from 'react';

import { Container } from './styles';

import { toastType } from '../../../utils/toast';
import { CheckCircle, XCircle } from 'phosphor-react';

interface ToastMessageProps {
  message: {
    id: number;
    text: string;
    type: toastType;
    duration?: number;
  };
  onRemoveMessage: (id: number) => void;
  isLeaving: boolean;
  animatedRef: React.MutableRefObject<HTMLDivElement | null>;
}

function ToastMessage({
  message, onRemoveMessage, isLeaving, animatedRef,
}: ToastMessageProps) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onRemoveMessage(message.id);
    }, message.duration || 7000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, onRemoveMessage]);

  function handleRemoveToast() {
    onRemoveMessage(message.id);
  }

  return (
    <Container
      type={message.type}
      isLeaving={isLeaving}
      onClick={handleRemoveToast}
      tabIndex={0}
      role="button"
      ref={animatedRef}
    >
      {message.type === 'danger' && <XCircle color="#E12729" size={24} weight="fill" />}
      {message.type === 'success' && <CheckCircle color="#15C694" size={24} weight="fill" />}
      <strong>{message.text}</strong>
    </Container>
  );
}

export default memo(ToastMessage);
