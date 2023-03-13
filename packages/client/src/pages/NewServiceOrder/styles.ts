import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-rows: 48px 1fr 52px;
  row-gap: 20px;
  height: calc(100% - 92px);

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
      margin-bottom: 12px;

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
  }

  footer {
    display: flex;
    gap: 8px;
  }
`;
