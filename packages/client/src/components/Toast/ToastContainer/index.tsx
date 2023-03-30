import { useEffect } from 'react';
import useAnimatedList from '../../../hooks/useAnimatedList';
import { toastEventManager, ToastPayload, toastType } from '../../../utils/toast';
import ToastMessage from '../ToastMessage';
import { Container } from './styles';

export function ToastContainer() {
  const {
    setItems: setMessages,
    renderList,
    handleRemoveItem,
  } = useAnimatedList<{
    id: number;
    type: toastType;
    text: string;
    duration?: number;
  }>([]);

  useEffect(() => {
    function handleAddToast({ type, text, duration }: ToastPayload) {
      setMessages((prevState) => [
        ...prevState,
        {
          id: Math.random(), type, text, duration,
        },
      ]);
    }

    toastEventManager.on('addtoast', handleAddToast);

    return () => {
      toastEventManager.removeListener('addtoast', handleAddToast);
    };
  }, [setMessages]);

  return (
    <Container>
      {renderList((message, { isLeaving, animatedRef }) => (
        <ToastMessage
          key={message.id}
          message={message}
          onRemoveMessage={handleRemoveItem}
          isLeaving={isLeaving}
          animatedRef={animatedRef}
        />
      ))}
    </Container>
  );
}
