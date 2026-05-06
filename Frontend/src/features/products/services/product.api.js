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

export async function getProductDetailsById(productId) {
  const response = await productAPIInstance.get(`/details/${productId}`);
  return response.data;
}

export async function addProductVariant(productId, newProductVariant) {
  const formData = new FormData();
  

  newProductVariant.images.forEach((image, index) => {
    formData.append(`images`, image);
  });
  formData.append("stock", newProductVariant.stock);
  formData.append("priceAmount", newProductVariant.price.amount);
  formData.append("attributes", JSON.stringify(newProductVariant.attributes));

  const response = await productAPIInstance.post(
    `/${productId}/variants`,
    formData,
  );

  return response.data;
}
