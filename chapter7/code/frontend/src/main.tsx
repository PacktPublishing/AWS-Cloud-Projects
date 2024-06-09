import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { amplifyConfig } from "./configs/aws-exports";
import { Amplify } from "aws-amplify";

Amplify.configure(amplifyConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
