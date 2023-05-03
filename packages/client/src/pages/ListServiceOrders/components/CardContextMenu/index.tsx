import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, NotePencil, Trash } from 'phosphor-react';
import { Container } from './styles';
import useAnimatedUnmount from '../../../../hooks/useAnimatedUnmount';
import { useResponsiveContext } from '../../../../contexts/ResponsiveContext';

interface CardContextMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
  serviceOrderId: string;
}

export function CardContextMenu({
  isVisible,
  onClose,
  onDelete,
  serviceOrderId
}: CardContextMenuProps) {
  const contextRef = useRef<HTMLDivElement | null>(null);
  const { shouldRender, animatedElementRef } = useAnimatedUnmount(isVisible);
  const navigate = useNavigate();
  const { isMobile } = useResponsiveContext();

  const setRefs = useCallback((element: HTMLDivElement) => {
    contextRef.current = element;
    animatedElementRef.current = element;
  }, [contextRef, animatedElementRef]);

  useEffect(() => {
    const handleClickOutside: EventListenerOrEventListenerObject = (event) => {
      if (
        contextRef.current &&
        !contextRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [onClose]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Container ref={setRefs} isLeaving={!isVisible}>
      <button onClick={() => {
        navigate(`duplicate/${serviceOrderId}`);
      }}>
        <Copy color="#888888" size={16} weight="bold" />
        Duplicar Ordem
      </button>
      {!isMobile && (
        <>
          <button onClick={() => {
            navigate(`edit/${serviceOrderId}`);
          }}>
            <NotePencil color="#888888" size={16} weight="bold" />
            Editar Ordem
          </button>
          <button className="danger" onClick={() => {
            onClose();
            onDelete();
          }}>
            <Trash color="#E12729" size={16} weight="bold" />
            Deletar Ordem
          </button>
        </>
      )}
    </Container>
  );
}
