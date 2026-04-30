import axios from "axios";

const authAPIInstance = axios.create({
  baseURL: "http://localhost:5000/api/auth",
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
