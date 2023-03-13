import { createGlobalStyle } from 'styled-components';

export const AntSelectStyles = createGlobalStyle`
  .ant-select-dropdown {
    background: #FBFBFB !important;
    border-radius: 4px !important;

    .ant-select-item.ant-select-item-option {
      padding: 8px 12px !important;
      color: #343434 !important;
      font-size: 14px !important;

      &.ant-select-item-option-selected {
        background: #BDD8C7 !important;
        font-weight: 600 !important;
      }

      &.ant-select-item-option-active {
        background: rgba(211, 229, 217, 0.5) !important;
      }
    }
  }
`;
