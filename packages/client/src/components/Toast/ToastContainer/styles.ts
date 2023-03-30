import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 999;
  width: calc(100% - 32px);
  max-width: 360px;
`;
