import axios from "axios";

const productAPIInstance = axios.create({
  baseURL: "/api/product",
  withCredentials: true,
});

export async function createProduct(formData) {
  const response = await productAPIInstance.post("/", formData);
  return response.data;
}

export async function getSellerProduct() {
  const response = await productAPIInstance.get("/seller");
  return response.data;
}
