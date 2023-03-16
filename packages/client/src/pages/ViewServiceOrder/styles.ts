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

  main {
    overflow: auto;

    .info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;

      .stretch {
        grid-column-end: span 2;
      }

      div {
        > strong {
          font-weight: 600;
          font-size: 12px;
          color: #48AF7A;
        }

        span {
          font-weight: 500;
          font-size: 16px;
          display: block;

          strong {
            margin-left: 8px;
          }
        }
      }

    }

    h3 {
      color: #005125;
      font-size: 18px;
      font-weight: 700;
      margin-top: 20px;
    }

    .card {
      margin-top: 12px;
      padding: 12px;
      background: #E9F2EC;
      border: 1px solid #BDD8C7;
      border-radius: 4px;
      box-shadow: 0px 4px 6px rgba(0, 60, 35, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.12);

      h4 {
        font-weight: 600;
        font-size: 14px;
      }

      .info {
        row-gap: 4px;
      }
    }
  }
`;
