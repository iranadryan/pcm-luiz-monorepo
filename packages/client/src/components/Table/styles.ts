import styled from 'styled-components';

export const Container = styled.div`
  overflow: auto;

  table {
    border-spacing: 1;
    border-collapse: collapse;
    width: 100%;
    border-radius: 4px;
    overflow: hidden;

    td, th {
      padding: 8px;
      font-size: 14px;
      border-bottom: 1px solid #BDD8C7;
    }

    th {
      font-weight: 600;
      background: #e9f2ec;
    }

    td {
      &.align-center {
        text-align: center;
      }

      strong {
        font-weight: 600;
      }

      button {
        display: inline-flex;
        background: transparent;
        border: none;
        outline: none;

        & + button {
          margin-left: 8px;
        }
      }
    }

    tbody {
      tr:nth-child(even) {
        background: rgba(233, 242, 236, 0.3);
      }
    }
  }
`;
