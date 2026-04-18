import { createBrowserRouter } from "react-router";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import CreateProduct from "../features/products/pages/createProduct";
import GetProducts from "../features/products/pages/GetProducts";
import ProductDetailed from "../features/products/components/ProductDetailed";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>hello world</h1>,
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
        path: "/seller/dashboard",
        element: <GetProducts />,
      },
      {
        path: "/seller/create-product",
        element: <CreateProduct />,
      },
      {
        path: "/seller/product/:id",
        element: <ProductDetailed />,
      },
    ],
  },
]);
