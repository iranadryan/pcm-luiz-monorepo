import styled from 'styled-components';

interface ContainerProps {
  headerHeight: string;
}

export const Container = styled.div<ContainerProps>`
  display: grid;
  grid-template-rows: 49px 1fr;
  row-gap: 20px;
  height: calc(100% - ${({ headerHeight }) => headerHeight});

  header {
    display: flex;
    gap: 8px;
    align-items: center;

    .back-button {
      height: 48px;
      width: 48px;
      background: #007f4e;
      border: none;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  main {
    overflow: auto;

    .menu {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;

      button {
        height: 40px;
        border-radius: 8px;
        border: none;
      }
    }
  }
`;
