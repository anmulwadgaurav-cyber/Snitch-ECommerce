import axios from "axios";
//http://localhost:5000
const productAPIInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export async function createProduct(formData) {
  const response = await productAPIInstance.post("/", formData);
  return response.data;
}

export async function getSellerProducts() {
  const response = await productAPIInstance.get("/seller");
  return response.data;
}

export async function getAllProducts() {
  const response = await productAPIInstance.get("/");
  return response.data;
}
