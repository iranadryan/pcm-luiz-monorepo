import styled from 'styled-components';

export const Container = styled.header`
  padding: 16px 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    display: none;
  }

  img {
    height: 40px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 4px;

    button {
      display: flex;
      background: #48af7a;
      padding: 6px;
      border: none;
      outline: none;
      border-radius: 8px;

      &.danger {
        background: #eb8b8c;
      }
    }
  }
`;
