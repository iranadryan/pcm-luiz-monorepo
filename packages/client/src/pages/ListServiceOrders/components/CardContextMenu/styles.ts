import styled, { css, keyframes } from 'styled-components';

const openAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const closeAnimation = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0);
  }
`;

interface ContainerProps {
  isLeaving: boolean;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  background: #FBFBFB;
  border: 1px solid #BDD8C7;
  border-radius: 4px;
  box-shadow: 0 .125rem .25rem rgba(0, 0, 0, 0.1);
  position: absolute;
  right: 8px;
  top: 8px;
  z-index: 10;
  transform-origin: top right;
  animation: ${openAnimation} 0.3s ease-in-out;
  width: 152px;

  ${({ isLeaving }) => isLeaving && css`
    animation: ${closeAnimation} 0.2s ease-out forwards;
  `}

  button {
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #888888;
    padding: 6px;
    text-align: left;
    border-radius: 2px;

    &:hover, &:active {
      background-color: rgba(211, 229, 217, 0.5);
      font-weight: 400;
    }
  }

  .close {
    align-self: flex-end;
  }
`;
