import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";

import "./index.css";
import App from "./App";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <BrowserRouter basename="/App">
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
