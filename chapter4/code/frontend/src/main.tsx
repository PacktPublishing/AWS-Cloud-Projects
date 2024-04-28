import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import UsersPage from "./pages/Users/UsersPage";
import AdminPage from "./pages/Admin/AdminPage";
import ErrorPage from "./pages/ErrorPage/errorPage";
import { appConfig } from "./configs/configs";
import { Amplify } from "aws-amplify";
import { amplifyConfig } from "./configs/aws-exports";
import AuthenticatedRoute from "./components/Auth/AuthenticatedRoute";

Amplify.configure(amplifyConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "users",
    element: <UsersPage />,
  },
  {
    path: "admin",
    element: (
      <AuthenticatedRoute>
        <AdminPage />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

document.addEventListener("DOMContentLoaded", () => {
  const titleElement = document.querySelector("title");
  if (titleElement) {
    titleElement.textContent = appConfig.title;
  } else {
    console.error("Title element not found in the DOM.");
  }

  const linkElement = document.querySelector('link[rel="icon"]');
  if (linkElement) {
    const linkElementWithHref = linkElement as HTMLLinkElement;
    linkElementWithHref.href = `/${appConfig.iconFileName}`;
  } else {
    console.error("Link element not found in the DOM.");
  }
});
