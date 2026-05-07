import { createBrowserRouter } from "react-router";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import Cart from "../features/cart/pages/Cart";

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
    element: <ProductDetail />,
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
      {
        path: "/seller/product/:productId",
        element: (
          <Protected role="seller" children={<SellerProductDetails />} />
        ),
      },
    ],
  },
  {
    path: "/cart",
    element: <Protected role="seller" children={<Cart />} />,
  },
]);
