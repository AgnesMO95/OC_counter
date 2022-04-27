import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    //this is the shared style
    html {
        box-sizing: border-box;
    }
    *,
    *::before,
    *::after {
        box-sizing: inherit;
    }

    body {
        background-color: #687ddb;
        position: relative;
    }

    h1 {
        color:  #372197 !important; // the important is just to show that the style works!
        position: right;
        margin-left: 20px;
    }
    // anything else you would like to include
    `

const BasicLayout = ({ children }: { children: any }) => {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  )
}

export default BasicLayout
