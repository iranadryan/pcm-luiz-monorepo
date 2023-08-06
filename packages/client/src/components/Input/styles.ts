import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;

  label {
    font-weight: 600;
    font-size: 12px;
    color: #48af7a;
  }
`;

export const Container = styled.div`
  display: flex;
  height: 48px;
  width: 100%;
  background: #e9f2ec;
  border: 1px solid #bdd8c7;
  border-radius: 4px;
  box-shadow:
    0px 2px 6px rgba(0, 60, 35, 0.08),
    0px 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 300ms ease-in-out;
  appearance: none;

  &:focus-within {
    border-color: #007f4e;
  }

  button {
    padding: 0 4px;
    margin: 0 12px 0 4px;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const StyledInput = styled.input`
  height: 100%;
  width: 100%;
  border: none;
  background: transparent;
  padding: 0 16px;
  font-size: 16px;
  color: #343434;
  outline: none;

  &::placeholder {
    color: #7bb292;
  }

  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;
