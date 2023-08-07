import styled from 'styled-components';

interface ContainerProps {
  headerHeight: string;
  showFilters?: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: grid;
  grid-template-rows: ${({ showFilters }) => (showFilters ? 169 : 49)}px 25px 1fr;
  row-gap: 20px;
  height: calc(100% - ${({ headerHeight }) => headerHeight});

  .filters {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .input-container {
      display: flex;
      align-items: center;
      gap: 4px;

      button {
        padding: 4px;
        display: flex;
        background: transparent;
        border: none;
        outline: none;
      }
    }

    .date-filter {
      display: flex;
      gap: 12px;
    }
  }

  .title {
    display: flex;
    gap: 8px;
    align-items: center;

    > span {
      font-weight: 600;
      font-size: 14px;
      color: #48af7a;
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
    background: #007f4e;
    border: none;
    box-shadow:
      0px 4px 12px 4px rgba(0, 60, 35, 0.2),
      0px 1px 3px rgba(0, 0, 0, 0.15);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
