import React, { useEffect } from "react";
import Nav from "../features/shared/components/Nav";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useCart } from "../features/cart/hook/useCart";

const AppLayout = () => {
  const cartData = useSelector((state) => state.cart.items); // [{_id, items:[...], total, currency}]
  const cartItems = cartData[0]?.items || [];
  const count = cartItems.reduce((total, item) => total + item.quantity, 0);
  const { handleGetCart } = useCart();

  useEffect(() => {
    handleGetCart();
  }, []);

  return (
    <>
      <Nav count={count} />
      <Outlet />
    </>
  );
};

export default AppLayout;
