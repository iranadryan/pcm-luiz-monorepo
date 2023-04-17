import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;

  .check {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 2px;
    cursor: pointer;
  }

  label {
    cursor: pointer;
    font-weight: 500;
  }
`;

export const StyledCheckbox = styled.input.attrs(() => ({
  type: 'checkbox'
}))`
  appearance: none;
  width: 24px;
  height: 24px;
  background: #E9F2EC;
  border: 1px solid #BDD8C7;
  border-radius: 4px;
  box-shadow: 0px 2px 6px rgba(0, 60, 35, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s;

  &:checked {
    background: #007F4E;
  }
`;
