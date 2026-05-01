import axios from "axios";
//http://localhost:5000
const authAPIInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export async function register({
  email,
  password,
  contact,
  fullname,
  isSeller,
}) {
  const response = await authAPIInstance.post("/register", {
    email,
    password,
    contact,
    fullname,
    isSeller,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await authAPIInstance.post("/login", { email, password });
  return response.data;
}
