import styled from 'styled-components';

export const Container = styled.aside`
  width: 280px;
  background: #E9F2EC;
  border: 1px solid #BDD8C7;
  box-shadow: 0px 2px 6px rgba(0, 60, 35, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.08);
  padding: 24px 12px;
  display: flex;
  flex-direction: column;

  @media (max-width: 767px) {
    display: none;
  }

  > img {
    width: 220px;
    margin: 0 auto;
  }

  .wtree {
    margin-top: 24px;

    ul + li {
      margin-top: 8px;
    }

    li {
      list-style-type: none;

      span {
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        color: #48AF7A;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      a {
        /* border: 1px solid red; */
        border-radius: 4px;
        padding: 8px 12px;
        width: 100%;
        display: flex;
        text-decoration: none;
        color: #343434;
        transition: all 0.2s ease-in-out;
        font-size: 14px;
        font-weight: 500;

        &:hover {
          background: rgba(189, 216, 199, 0.7);
        }

        &.active {
          background: #007f4e;
          color: #ffffff;
          font-weight: 600;
        }
      }
    }

    ul {
      padding-left: 8px;
      margin-top: 4px;
      counter-reset: item;

      li {
        margin-left: 14px;
        position: relative;

        &::before {
          content: "";
          counter-reset: item;
          position: absolute;
          top: 0px;
          left: -12px;
          border-left: 1px solid #91bea3;
          border-bottom: 1px solid #91bea3;
          border-bottom-left-radius: 8px;
          width: 12px;
          height: 20px;
        }

        &::after {
          content: "";
          position: absolute;
          top: 4px;
          left: -12px;
          border-left: 1px solid #91bea3;
          width: 12px;
          height: 110%;
        }

        &:last-child::after {
          display:none;
          background-color: red;
        }
      }
    }
  }
`;
