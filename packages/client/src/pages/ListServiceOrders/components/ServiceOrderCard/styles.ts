import styled from 'styled-components';

export const Container = styled.section`
  padding: 12px;
  background: #E9F2EC;
  border: 1px solid #BDD8C7;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 60, 35, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.12);

  header {
    display: flex;
    align-items: center;

    .icon {
      height: 40px;
      width: 40px;
      background: #BDD8C7;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    strong {
      font-weight: 600;
      font-size: 20px;
      color: #005125;
      margin-left: 8px;
    }

    small {
      padding: 2px 4px;
      background: #005125;
      border-radius: 4px;
      color: #FFFFFF;
      font-size: 10px;
      margin-left: 4px;
      line-height: 12px;

      &.open {
        background: #F37324;
      }
    }
  }

  .info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 8px;

    strong {
      font-weight: 600;
      font-size: 12px;
      color: #48AF7A;
    }

    span {
      font-weight: 500;
      font-size: 16px;
      display: block;
    }
  }

  .dates {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;

    span {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: #666666;
    }
  }

  footer {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }
`;
