import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "/api/auth", //look for vite.config.js file yaha pe proxy perform ho rahi hai
  withCredentials: true,
});

export async function register({
  email,
  contact,
  password,
  fullname,
  isSeller,
}) {
  const response = await authApiInstance.post("/register", {
    email,
    contact,
    password,
    fullname,
    isSeller,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await authApiInstance.post("/login", {
    email,
    password,
  });

  return response.data;
}
