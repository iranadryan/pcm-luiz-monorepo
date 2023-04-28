import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  .close-button {
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    margin-left: auto;
  }

  .dropzone {
    margin-top: 12px;
    background: #E9F2EC;
    border: 1px dashed #BDD8C7;
    border-radius: 4px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    em {
      font-size: 12px;
      color: #868686;
    }

    .placeholder {
      color: #7BB292;
    }
  }
`;
