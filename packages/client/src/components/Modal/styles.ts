import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const scaleIn = keyframes`
  from { transform: scale(0); }
  to { transform: scale(1); }
`;

const scaleOut = keyframes`
  from { transform: scale(1); }
  to { transform: scale(0); }
`;

interface OverlayProps {
  isLeaving: boolean;
}

export const Overlay = styled.div<OverlayProps>`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  animation: ${fadeIn} 0.3s;

  ${({ isLeaving }) => isLeaving && css`
    animation: ${fadeOut} 0.3s forwards;
  `}
`;

interface ContainerProps {
  isLeaving: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 100%;
  max-width: calc(720px - 48px);
  background: #FBFBFB;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0px 4px 6px rgba(0, 60, 35, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.12);
  z-index: 10;
  animation: ${scaleIn} 0.3s;

  ${({ isLeaving }) => isLeaving && css`
    animation: ${scaleOut} 0.3s forwards;
  `}
`;
