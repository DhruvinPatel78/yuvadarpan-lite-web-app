import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import FullPageLoader from "./Component/Common/FullPageLoader";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PersistGate persistor={persistor} loading={<FullPageLoader />}>
          <App />
        </PersistGate>
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
);

reportWebVitals();

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
  },
});
