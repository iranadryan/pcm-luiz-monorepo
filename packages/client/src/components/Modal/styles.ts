import styled from 'styled-components';

export const Overlay = styled.div`
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
`;

export const Container = styled.div`
  width: 100%;
  max-width: calc(720px - 48px);
  background: #FBFBFB;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0px 4px 6px rgba(0, 60, 35, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.12);
  z-index: 10;
`;
