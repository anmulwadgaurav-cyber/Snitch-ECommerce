import { createBrowserRouter } from "react-router";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/seller",
    children: [
      {
        path: "/seller/create-product",
        element: <Protected role="seller" children={<CreateProduct />} />,
      },
      {
        path: "/seller/dashboard",
        element: <Protected role="seller" children={<Dashboard />} />,
      },
    ],
  },
]);
