import {
  addItem,
  decrementCartItemAPI,
  getCart,
  incrementCartItemAPI,
  removeCartItemAPI,
} from "../service/cart.api";
import {
  setItems,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
} from "../state/cart.slice.js";
import { useDispatch } from "react-redux";

export const useCart = () => {
  const dispatch = useDispatch();

  async function handleAddItem({ productId, variantId }) {
    const data = await addItem({ productId, variantId });
    // Re-fetch full cart to sync Redux state (counter updates in real-time)
    const cartData = await getCart();
    dispatch(setItems(cartData.cart));
    return data;
  }

  async function handleGetCart() {
    const data = await getCart();
    dispatch(setItems(data.cart));
  }

  async function handleIncrementCartItem({ productId, variantId }) {
    const data = await incrementCartItemAPI({ productId, variantId });
    dispatch(incrementCartItem({ productId, variantId }));
  }

  async function handleDecrementCartItem({ productId, variantId }) {
    const data = await decrementCartItemAPI({ productId, variantId });
    dispatch(decrementCartItem({ productId, variantId }));
  }

  async function handleRemoveCartItem({ productId, variantId }) {
    const data = await removeCartItemAPI({ productId, variantId });
    dispatch(removeCartItem({ productId, variantId }));
  }

  return {
    handleAddItem,
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveCartItem,
  };
};
