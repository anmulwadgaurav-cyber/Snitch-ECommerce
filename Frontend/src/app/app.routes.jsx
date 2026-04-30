import { createBrowserRouter } from "react-router";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>Welcome</h1>,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
