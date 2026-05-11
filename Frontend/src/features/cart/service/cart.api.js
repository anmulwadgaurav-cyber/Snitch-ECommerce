import axios from "axios";

const cartAPIInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export const addItem = async ({ productId, variantId }) => {
  const response = await cartAPIInstance.post(
    `/add/${productId}/${variantId}`,
    {
      quantity: 1,
    },
  );
  return response.data;
};

export const getCart = async () => {
  const response = await cartAPIInstance.get("/");
  return response.data;
};

export const incrementCartItemAPI = async ({ productId, variantId }) => {
  const response = await cartAPIInstance.patch(
    `/quantity/increment/${productId}/${variantId}`,
  );
  return response.data;
};

export const decrementCartItemAPI = async ({ productId, variantId }) => {
  const response = await cartAPIInstance.patch(
    `/quantity/decrement/${productId}/${variantId}`,
  );
  return response.data;
};

export const removeCartItemAPI = async ({ productId, variantId }) => {
  const response = await cartAPIInstance.delete(
    `/delete/${productId}/${variantId}`,
  );
  return response.data;
};

export const createCartOrder = async () => {
  const response = await cartAPIInstance.post("/payment/create/order");
  return response.data;
};

export const verifyCartOrder = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const response = await cartAPIInstance.post("/payment/verify/order", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return response.data;
};
