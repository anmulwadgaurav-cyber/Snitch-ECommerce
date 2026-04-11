import { createBrowserRouter } from "react-router";
import RegisterPage from "../features/auth/pages/RegisterPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>hello world</h1>,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
