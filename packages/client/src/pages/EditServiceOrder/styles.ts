import styled from 'styled-components';

interface ContainerProps {
  headerHeight: string;
}

export const Container = styled.div<ContainerProps>`
  display: grid;
  grid-template-rows: 48px 1fr 52px;
  row-gap: 20px;
  height: calc(100% - ${({ headerHeight }) => headerHeight});

  header {
    display: flex;
    gap: 8px;
    align-items: center;

    .back-button {
      height: 48px;
      width: 48px;
      background: #007F4E;
      border: none;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .form {
    overflow-y: auto;

    .date-input {
      display: flex;
      gap: 8px;
    }

    .add-activity {
      display: flex;
      gap: 8px;

      button {
        width: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #007F4E;
        border: none;
        border-radius: 4px;
      }
    }

    .error-message {
      color: #E12729;
      font-size: 12px;
      font-weight: 600;
    }
  }

  footer {
    display: flex;
    gap: 8px;
  }
`;
