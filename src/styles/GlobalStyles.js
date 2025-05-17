import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --tg-theme-bg-color: #ffffff;
    --tg-theme-text-color: #000000;
    --tg-theme-button-color: #3390ec;
    --tg-theme-button-text-color: #ffffff;
    --tg-theme-secondary-bg-color: #f0f0f0;
    
    --container-padding: 20px;
    --border-radius: 10px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: var(--tg-theme-bg-color);
    color: var(--tg-theme-text-color);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    min-height: 100vh;
    padding-bottom: 10px;
  }

  button {
    background-color: var(--tg-theme-button-color);
    color: var(--tg-theme-button-text-color);
    border: none;
    border-radius: var(--border-radius);
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.8;
    }
    
    &:active {
      opacity: 0.6;
    }
  }

  input, textarea {
    background-color: var(--tg-theme-secondary-bg-color);
    color: var(--tg-theme-text-color);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: var(--border-radius);
    padding: 12px;
    font-size: 16px;
    width: 100%;
    margin-bottom: 16px;
    outline: none;
    
    &:focus {
      border-color: var(--tg-theme-button-color);
    }
  }

  h1, h2, h3 {
    margin-bottom: 15px;
  }

  .container {
    padding: 0 var(--container-padding);
    max-width: 600px;
    margin: 0 auto;
  }

  .card {
    background-color: var(--tg-theme-secondary-bg-color);
    border-radius: var(--border-radius);
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
`;

export default GlobalStyles; 