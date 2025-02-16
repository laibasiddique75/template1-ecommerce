"use client";
import { createSlice } from "@reduxjs/toolkit";

// Define the initial state using that type
export const cartSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    // Add to cart functionality
    add(state: any, action) {
      let uuid = Math.floor(1000 + Math.random() * 9000);
      let newobj = { ...action.payload, uuid };
      state.push(newobj);
    },

    // Delete from cart
    remove(state: any, { payload }) {
      return state.filter((val: any) => val.uuid !== payload);
    },

    // Addition of item
    addition(state: any, action) {
      let obj = state.find(
        (val: any) =>
          val.id == action.payload.id &&
          val.color == action.payload.color &&
          val.size == action.payload.size
      );
      if (obj) {
        ++obj.qty;
        let newState = state.filter((val: any) => val.id !== obj.id);
        state = [...newState, obj];
        return;
      }
    },

    // Subtraction of item
    subraction(state: any, action) {
      let obj = state.find(
        (val: any) =>
          val.id == action.payload.id &&
          val.color == action.payload.color &&
          val.size == action.payload.size
      );
      if (obj !== undefined) {
        --obj.qty;
        let newState = state.filter((val: any) => val.uuid !== obj.uuid);
        state = [...newState, obj];
        return;
      }
    },

    // Remove order from localStorage
    removeOrderFromLocalStorage(state: any) {
      // Empty the cart in the Redux state
      state.length = 0;
      // Remove the cart details from localStorage
      localStorage.removeItem("cart");
    },

    // ✅ Clear cart action
    clearCart(state: any) {
      state.length = 0; // Clear the Redux cart state
    },
  },
});

export const { add, remove, addition, subraction, removeOrderFromLocalStorage, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
