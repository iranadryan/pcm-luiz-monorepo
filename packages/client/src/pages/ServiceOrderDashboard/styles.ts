import styled from 'styled-components';

interface ContainerProps {
  headerHeight: string;
}

export const Container = styled.div<ContainerProps>`
  display: grid;
  grid-template-rows: 24px 1fr;
  row-gap: 20px;
  height: calc(100% - ${({ headerHeight }) => headerHeight});

  main {
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    > div:last-child {
      margin-bottom: 4px;
    }
  }

  .open-closed-totalizer {
    display: flex;
    align-items: center;
    gap: 12px;

    > .card {
      width: 100%;
      padding: 16px;
      background: #E9F2EC;
      border: 1px solid #BDD8C7;
      border-radius: 4px;
      box-shadow: 0px 4px 6px rgba(0, 60, 35, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      gap: 12px;

      span {
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        color: #48AF7A;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      strong {
        font-size: 28px;
        font-weight: 600;
        margin-top: 2px;
      }
    }
  }

  .chart-dashboard {
    h2 {
      font-size: 16px;
      font-weight: 600;
    }

    header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      .filters {
        display: flex;
        gap: 8px;
      }

      .range-input {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
      }
    }


    .container {
      margin-top: 8px;
      padding: 12px;
      background: #E9F2EC;
      border: 1px solid #BDD8C7;
      border-radius: 4px;
      box-shadow: 0px 4px 6px rgba(0, 60, 35, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.12);
      width: 100%;
      min-height: 320px;
      position: relative;

      .center-content {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        strong {
          font-size: 40px;
          font-size: 600;
          line-height: 120%;
          display: block;
        }

        span {
          font-size: 14px;
          font-weight: 500;
          line-height: 120%;
          display: block;
        }
      }

      .chart-container {
        height: 320px;
        width: 100%;
      }

      .paginator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 8px;

        span {
          font-size: 12px;
          font-weight: 600;
        }

        button {
          display: flex;
          background: transparent;
          border: none;
          transition: all 0.2s ease-in-out;

          &.hidden {
            visibility: hidden;
          }

          &[aria-label="previous-page"]:hover {
            transform: translateX(-4px);
          }

          &[aria-label="next-page"]:hover {
            transform: translateX(4px);
          }
        }
      }
    }
  }
`;
