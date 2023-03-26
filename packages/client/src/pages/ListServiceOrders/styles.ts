import styled from 'styled-components';
import { HEADER_HEIGHT } from '../../components/Header/styles';

export const Container = styled.div`
  display: grid;
  grid-template-rows: 108px 24px 1fr;
  row-gap: 20px;
  height: calc(100% - ${HEADER_HEIGHT});

  .filters {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cards-list {
    display: grid;
    gap: 12px;
    height: 100%;
    overflow-y: auto;
    align-content: start;

    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 999px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #48AF7A;
      border-radius: 999px;
      border: 4px solid #FBFBFB;
    }
  }

  .new-order {
    height: 48px;
    width: 48px;
    position: fixed;
    bottom: 24px;
    right: 24px;
    border-radius: 999px;
    background: #007F4E;
    border: none;
    box-shadow: 0px 4px 12px 4px rgba(0, 60, 35, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.15);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
