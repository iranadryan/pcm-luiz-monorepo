import { createGlobalStyle } from 'styled-components';

export const SelectModalStyles = createGlobalStyle`
  .p-dropdown-panel {
    background: #FBFBFB !important;
    border-radius: 4px !important;
    overflow: hidden;
    padding: 4px !important;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    font-size: 14px;
    color: #343434 !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: calc(720px - 32px) !important;
    min-width: calc(720px - 32px) !important;
    max-width: calc(720px - 32px) !important;

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

    .p-dropdown-items-wrapper {
      &::-webkit-scrollbar {
        width: 12px;
      }

      &::-webkit-scrollbar-track {
        border-radius: 999px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #48AF7A;
        border-radius: 999px;
        border: 2px solid #FBFBFB;
      }

      .p-dropdown-item {
        padding: 8px 12px !important;
        border-radius: 4px;
        transition: all 0.3s ease-in-out !important;
        white-space: normal !important;

        &:hover {
          background: rgba(211, 229, 217, 0.5) !important;
        }

        &.p-highlight {
          background: #48AF7A !important;
          font-weight: 500 !important;
          color: #E7F0EB;
        }
      }
    }
  }
`;
