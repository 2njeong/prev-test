import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* 모든 요소의 마진, 패딩 제거 */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* 블록 요소/인라인 요소 구분 없이 모두 block 처리 */
  body, h1, h2, h3, h4, h5, h6, p, ul, ol, li, figure, figcaption, blockquote, dl, dd {
    margin: 0;
    padding: 0;
    font-weight: normal;
    font-size: 100%;
  }

  button, input, textarea {
    border: none;
    background: none;
    font: inherit;
  }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    background-color: #fff;
    color: #000;
    line-height: 1.5;
    width: 100vw;
    height: 100vh;
  }
`;

export default GlobalStyle;
