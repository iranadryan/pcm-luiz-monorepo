import styled from 'styled-components';

interface ContainerProps {
  headerHeight: string;
}

export const Container = styled.div<ContainerProps>`
  display: grid;
  grid-template-rows: 169px 25px 1fr;
  row-gap: 20px;
  height: calc(100% - ${({ headerHeight }) => headerHeight});

  .filters {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .date-filter {
      display: flex;
      gap: 12px;
    }
  }

  .cards-list {
    display: grid;
    gap: 12px;
    height: 100%;
    overflow-y: auto;
    align-content: start;
  }

  .new-order {
    height: 48px;
    width: 48px;
    position: fixed;
    bottom: 24px;
    right: 24px;
    border-radius: 999px;
    background: #007F4E;
    border: none;
    box-shadow: 0px 4px 12px 4px rgba(0, 60, 35, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.15);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
