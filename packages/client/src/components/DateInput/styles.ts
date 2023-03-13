import InputMask from 'react-input-mask';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;

  label {
    font-weight: 600;
    font-size: 12px;
    color: #48AF7A;
  }
`;

export const StyledInput = styled(InputMask)`
  height: 48px;
  width: 100%;
  background: #E9F2EC;
  border: 1px solid #BDD8C7;
  outline: none;
  border-radius: 4px;
  box-shadow: 0px 2px 6px rgba(0, 60, 35, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.08);
  padding: 0 16px;
  font-size: 16px;
  color: #343434;
  transition: all 300ms ease-in-out;
  appearance: none;

  &:focus {
    border-color: #007F4E;
  }

  &::placeholder {
    color: #7BB292;
  }
`;
