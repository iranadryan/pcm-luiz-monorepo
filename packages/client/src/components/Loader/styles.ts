import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

interface OverlayProps {
  isLeaving: boolean;
}

export const Overlay = styled.div<OverlayProps>`
  background: rgba(251, 251, 251, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  animation: ${fadeIn} 0.3s;

  ${({ isLeaving }) => isLeaving && css`
    animation: ${fadeOut} 0.3s forwards;
  `}
`;
