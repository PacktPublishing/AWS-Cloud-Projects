import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UsersPage from "./pages/Users/UsersPage";
import AdminPage from "./pages/Admin/AdminPage";
import ErrorPage from "./pages/ErrorPage/errorPage";
import { appConfig } from "./configs/configs";

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
    element: <AdminPage />,
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
