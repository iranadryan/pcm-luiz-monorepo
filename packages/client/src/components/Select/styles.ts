import styled, { css } from 'styled-components';
import { Dropdown } from 'primereact/dropdown';

export const Wrapper = styled.div<StyledSelectProps>`
  width: 100%;

  label {
    font-weight: 600;
    font-size: 12px;
    color: #48AF7A;
  }

  ${({ secondary }) => secondary && css`
    width: 200px;
  `}
`;

interface StyledSelectProps {
  secondary: boolean;
}

export const StyledSelect = styled(Dropdown)<StyledSelectProps>`
  width: 100% !important;
  height: 48px !important;
  background: #E9F2EC !important;
  border: 1px solid #BDD8C7 !important;
  outline: none !important;
  border-radius: 4px !important;
  box-shadow: 0px 2px 6px rgba(0, 60, 35, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.08) !important;
  padding: 0 16px !important;
  font-size: 16px !important;
  color: #343434 !important;
  font-family: 'Inter', sans-serif !important;
  align-items: center !important;
  gap: 8px !important;

  &.p-inputwrapper-focus {
    border-color: #007F4E !important;
  }

  .p-dropdown-label {
    padding: 0 !important;
    width: 1px;

    &.p-placeholder {
      color: #7BB292 !important;
    }
  }

  .p-dropdown-trigger {
    width: auto !important;

    .p-dropdown-trigger-icon {
      color: #005125 !important;
      font-weight: 700;
    }
  }

  ${({ secondary }) => secondary && css`
    height: 36px !important;
    width: 200px !important;
    padding: 0 12px !important;
    font-size: 14px !important;
  `}
`;
