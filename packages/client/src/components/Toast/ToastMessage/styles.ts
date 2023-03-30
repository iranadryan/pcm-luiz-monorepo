import styled, { css, keyframes } from 'styled-components';
import { toastType } from '../../../utils/toast';

const messageIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(60px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const messageOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(100px);
  }
`;

const containerVariants = {
  success: css`
    background: #CAEFDE;
    border: 1px solid #15C694;
    color: #0C926D;
  `,
  danger: css`
    background: #FFC6BF;
    border: 1px solid #E12729;
    color: #A71A1C;
  `
};

interface ContainerProps {
  isLeaving: boolean;
  type: toastType;
}

export const Container = styled.div<ContainerProps>`
  padding: 12px 12px;
  box-shadow: 0px 20px 20px -16px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  outline: none;
  animation: ${messageIn} 0.3s;

  ${({ isLeaving }) => isLeaving && css`
  animation: ${messageOut} 0.2s forwards;
  `}

  ${({ type }) => containerVariants[type]};

  strong {
    font-size: 14px;
    font-weight: 600;
    width: 100%;
  }

  & + & {
    margin-top: 8px;
  }
`;
