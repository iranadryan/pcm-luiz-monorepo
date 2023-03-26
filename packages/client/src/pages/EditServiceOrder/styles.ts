import styled from 'styled-components';
import { HEADER_HEIGHT } from '../../components/Header/styles';

export const Container = styled.div`
  display: grid;
  grid-template-rows: 48px 1fr 52px;
  row-gap: 20px;
  height: calc(100% - ${HEADER_HEIGHT});

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
    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 999px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #48AF7A;
      border-radius: 999px;
      border: 4px solid #FBFBFB;
    }

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
