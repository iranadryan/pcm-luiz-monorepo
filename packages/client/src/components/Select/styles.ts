import { Select } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;

  label {
    font-weight: 600;
    font-size: 12px;
    color: #48AF7A;
  }
`;

export const StyledSelect = styled(Select)`
  display: block !important;

  &.ant-select-open .ant-select-selector {
    border-color: #007F4E !important;
  }

  .ant-select-selector {
    height: 48px !important;
    width: 100% !important;
    background: #E9F2EC !important;
    border: 1px solid #BDD8C7 !important;
    outline: none !important;
    border-radius: 4px !important;
    box-shadow: 0px 2px 6px rgba(0, 60, 35, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.08) !important;
    padding: 0 16px !important;
    font-size: 16px !important;
    color: #343434 !important;
    font-size: 16px !important;
    transition: all 300ms ease-in-out !important;

    .ant-select-selection-placeholder {
      line-height: 48px !important;
      width: 80px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #7BB292 !important;
    }

    .ant-select-selection-item {
      line-height: 48px !important;
      width: 80px !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
