import styled, { css } from 'styled-components';

interface StyledButtonProps {
  secondary?: boolean;
  danger?: boolean;
  tertiary?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  width: 100%;
  height: 52px;
  background: #007f4e;
  outline: none;
  border: none;
  border-radius: 4px;
  color: #e7f0eb;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  appearance: none;

  ${({ secondary }) =>
    secondary &&
    css`
      height: 40px;
      font-size: 14px;
    `}

  ${({ danger }) =>
    danger &&
    css`
      background: #e12729;
    `}

  ${({ tertiary }) =>
    tertiary &&
    css`
      background: #cccccc;
      color: #ffffff;
    `}
`;
