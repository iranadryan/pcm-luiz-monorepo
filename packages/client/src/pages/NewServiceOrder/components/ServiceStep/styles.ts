import styled from 'styled-components';

export const ActivitiesList = styled.div`
`;

export const ActivityInput = styled.div`
  & + & {
    margin-top: 12px;
  }

  header {
    display: flex;
    align-items: center;

    h3 {
      font-weight: 600;
      font-size: 14px;
      color: #343434;
    }

    button {
      display: flex;
      align-items: center;
      background: transparent;
      border: none;
    }
  }


  .card {
    margin-top: 4px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 8px;
    row-gap: 4px;
    padding: 12px;
    background: rgba(189, 216, 199, 0.5);
    border-radius: 4px;
    box-shadow: inset 0px 2px 6px rgba(0, 60, 35, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.08);

    .stretch {
      grid-column-end: span 2;
    }

    .right-side {
      grid-column-end: 3;
      margin-top: 8px;
    }

    .material-list {
      margin-top: 8px;

      .material-item {
        display: flex;
        align-items: center;
        gap: 8px;

        & + .material-item {
          margin-top: 8px;
        }

        strong {
          flex: 1;
        }

        button {
          display: flex;
          align-items: center;
          background: transparent;
          border: none;
        }
      }
    }
  }
`;
