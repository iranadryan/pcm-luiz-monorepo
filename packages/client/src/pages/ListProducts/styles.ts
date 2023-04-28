import styled from 'styled-components';

interface ContainerProps {
  headerHeight: string;
}

export const Container = styled.div<ContainerProps>`
  display: grid;
  grid-template-rows: 41px 1fr;
  row-gap: 20px;
  height: calc(100% - ${({ headerHeight }) => headerHeight});

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .buttons {
      display: flex;
      gap: 12px;

      button {
        width: 120px;
      }
    }

  }
`;
