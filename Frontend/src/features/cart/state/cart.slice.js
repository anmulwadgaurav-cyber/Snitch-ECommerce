import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // shape: [{_id, items: [...], total, currency}]
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    incrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;
      if (!state.items[0]) return;
      state.items[0].items = state.items[0].items.map((item) => {
        if (item.product._id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    },
    decrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;
      if (!state.items[0]) return;
      state.items[0].items = state.items[0].items
        .map((item) => {
          if (item.product._id === productId && item.variant === variantId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    },
    removeCartItem: (state, action) => {
      const { productId, variantId } = action.payload;
      if (!state.items[0]) return;
      state.items[0].items = state.items[0].items.filter(
        (item) =>
          !(item.product._id === productId && item.variant === variantId),
      );
    },
  },
});

export const {
  setItems,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
} = cartSlice.actions;
export default cartSlice.reducer;
