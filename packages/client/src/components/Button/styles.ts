import styled, { css } from 'styled-components';

interface StyledButtonProps {
  secondary?: boolean;
  danger?: boolean;
  tertiary?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  width: 100%;
  height: 52px;
  background: #007F4E;
  outline: none;
  border: none;
  border-radius: 4px;
  color: #E7F0EB;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  appearance: none;

  ${({ secondary }) => secondary && css`
    height: 40px;
    font-size: 14px;
  `}

  ${({ danger }) => danger && css`
    background: #E12729;
  `}

  ${({ tertiary }) => tertiary && css`
    background: #CCCCCC;
    color: #FFFFFF;
  `}
`;
