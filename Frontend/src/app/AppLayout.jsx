import React, { useEffect } from "react";
import Nav from "../features/shared/components/Nav";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useCart } from "../features/cart/hook/useCart";

const AppLayout = () => {
  const items = useSelector((state) => state.cart.items);
  const count = items.reduce((total, item) => total + item.quantity, 0);
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
