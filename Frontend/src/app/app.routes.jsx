import { createBrowserRouter } from "react-router";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import CreateProduct from "../features/products/pages/createProduct";
import GetProducts from "../features/products/pages/GetProducts";
import ProductDetailed from "../features/products/components/ProductDetailed";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import DetailedPage from "../features/products/pages/DetailedPage";

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
    path: "/product/:productId",
    element: <DetailedPage />,
  },
  {
    path: "/seller",
    children: [
      {
        path: "/seller/dashboard",
        element: (
          <Protected role="seller">
            <GetProducts />
          </Protected>
        ),
      },
      {
        path: "/seller/create-product",
        element: (
          <Protected role="seller">
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "/seller/product/:id",
        element: (
          <Protected role="seller">
            <ProductDetailed />
          </Protected>
        ),
      },
    ],
  },
]);
