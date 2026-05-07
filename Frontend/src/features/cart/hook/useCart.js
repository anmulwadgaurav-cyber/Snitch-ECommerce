import { addItem, getCart } from "../service/cart.api";
import { addItem as addItemToCart } from "../state/cart.slice.js";
import { useDispatch } from "react-redux";

export const useCart = () => {
  const dispatch = useDispatch();

  async function handleAddItem({ productId, variantId }) {
    const data = await addItem({ productId, variantId });
    // dispatch(addItemToCart(data.item));
    return data;
  }

  async function handleGetCart(){
    const data = await 
  }

  return { handleAddItem };
};