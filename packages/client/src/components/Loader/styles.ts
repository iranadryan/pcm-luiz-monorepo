import styled from 'styled-components';

export const Overlay = styled.div`
  background: rgba(251, 251, 251, 0.6);
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
`;
