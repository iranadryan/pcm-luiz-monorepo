import styled from 'styled-components';

export const Container = styled.header`
  padding: 16px 0 32px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    display: none;
  }

  img {
    height: 44px;
  }
`;
