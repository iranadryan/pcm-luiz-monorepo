import styled from 'styled-components';

export const Container = styled.div`
  margin: auto 0;

  header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    img {
      align-self: center;
      margin-bottom: 56px;
    }

    p {
      margin-top: 8px;
      font-size: 14px;
    }
  }

  .form {
    margin-top: 32px;
  }
`;
