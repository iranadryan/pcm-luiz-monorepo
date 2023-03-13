import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
  }

  ::selection {
    background: #F37324;
    color: #FBFBFB;
  }

  body {
    background: #FBFBFB;
    color: #343434;
    line-height: 120%;
  }

  html, body, #root {
    height: 100vh;
  }

  button {
    cursor: pointer;
    font-size: 1rem;
    color: #333;
  }
`;
