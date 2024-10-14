// Disabling Entire File TS check until migration from JS is done.
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ApiContextProvider } from "./Context/APIContext.js";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiContextProvider>
        <App />
      </ApiContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
