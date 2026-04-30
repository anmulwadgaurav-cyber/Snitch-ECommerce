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
  const response = await authAPIInstance("/register", {
    email,
    password,
    contact,
    fullname,
    isSeller,
  });
  return response.data;
}
