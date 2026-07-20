import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  body {
    background-color: #f0f2f5;
    color: #363f5f;
    -webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
  }

  input, select, button {
    font-family: inherit;
  }
`;