import { createGlobalStyle } from 'styled-components';

export const SelectModalStyles = createGlobalStyle`
  .p-dropdown-panel {
    background: #FBFBFB;
    border-radius: 4px;
    overflow: hidden;
    padding: 4px;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    font-size: 14px;
    color: #343434;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: calc(720px - 32px) !important;
    min-width: calc(720px - 32px) !important;
    max-width: calc(720px - 32px) !important;

    @media (min-width: 768px) {
      left: calc(50% + 140px) !important;
    }

    &.modal {
      width: calc(720px - 80px) !important;
      min-width: calc(720px - 80px) !important;
      max-width: calc(720px - 80px) !important;
    }

    @media (max-width: 720px) {
      width: calc(100% - 32px) !important;
      min-width: calc(100% - 32px) !important;
      max-width: calc(100% - 32px) !important;

      &.modal {
        width: calc(100% - 80px) !important;
        min-width: calc(100% - 80px) !important;
        max-width: calc(100% - 80px) !important;
      }
    }

    .p-dropdown-header {
      padding: 4px;

      .p-dropdown-filter-container {
        input {
          background: #E9F2EC;
          border: 1px solid #BDD8C7;
          height: 40px;
          border-radius: 4px;
          outline: 0;
          padding: 0 32px 0 12px;
          text-transform: uppercase;
          font-size: 14px;
        }

        i {
          right: 12px;
          margin-top: 0;
          transform: translateY(-40%);
          color: #005125;
          font-weight: 700;
        }
      }
    }

    .p-dropdown-items-wrapper {

      .p-dropdown-empty-message {
        padding: 8px;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
      }

      .p-dropdown-item {
        padding: 8px 12px;
        border-radius: 4px;
        transition: all 0.3s ease-in-out;
        white-space: normal;

        &:hover {
          background: rgba(211, 229, 217, 0.5);
        }

        &.p-highlight {
          background: #48AF7A;
          font-weight: 500;
          color: #E7F0EB;
        }
      }
    }
  }
`;
