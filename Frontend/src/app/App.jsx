import React, { useEffect } from "react";
import { Navigate, RouterProvider } from "react-router";
import { routes } from "./app.routes.jsx";
import "./App.css";
import { useSelector } from "react-redux";
import { useAuth } from "../features/auth/hook/useAuth.js";

const App = () => {
  //Hydration
  const { handleGetMe } = useAuth();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    handleGetMe();
  }, []);

  console.log(user);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
