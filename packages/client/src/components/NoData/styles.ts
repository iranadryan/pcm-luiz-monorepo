import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 32px;

  img {
    max-width: 260px;
  }

  h3 {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
  }

  p {
    text-align: center;
    color: #666666;
    font-size: 14px;
  }
`;
