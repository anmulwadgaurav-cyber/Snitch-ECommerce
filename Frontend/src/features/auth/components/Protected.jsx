import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children, role = "buyer" }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return <div>Loding...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  //children matlab the components wrapper inside this protected component.
  //children ka matlab yah hai ki agar iss line tak sabkuch accha raha tabhi children return honge

  return children;
};

export default Protected;
