import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
*{
    margin:0;
    list-style: none;
    text-decoration: none;
    outline:none;
}
html,body, div#root,main{
    height: 100%;
}
body{
    background: #aea7c2;
    font-family:"Montserrat";
}
`;

ReactDOM.render(
    <>
        <GlobalStyle/>
        <App />
    </>
    , document.getElementById("root"))