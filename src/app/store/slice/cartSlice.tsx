/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


interface CartItem {
  id: number;
  title?: string;
  price?: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  loading: boolean;
  error: string | null;
}

const getUserId = () =>
  typeof window !== "undefined" ? Cookies.get("userId") : null;

const calculateTotalQuantity = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  loading: false,
  error: null,
};

export const fetchCartByUser = createAsyncThunk(
  "cart/fetchByUser",
  async (userId: any) => {
    try {
      const res = await fetch(`${BASE_URL}/carts/user/${userId}`);
      const data = await res.json();

      if (data?.carts?.[0]?.products) {
        return data.carts[0].products as CartItem[];
      }
    } catch (e) {
      console.warn("API failed, falling back to localStorage");
    }

    const stored = localStorage.getItem(`cart_${userId}`);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  }
);


export const addToCart = createAsyncThunk(
  "cart/add",
  async (
    { productId, quantity }: { productId: number; quantity: number },
    { dispatch }
  ) => {
    const userId = getUserId();
    try {
      await fetch(`${BASE_URL}/carts/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          products: [{ id: productId, quantity }],
        }),
      });

      if (userId) {
        dispatch(fetchCartByUser(userId));
      }
    } catch (e) {
      console.warn("AddToCart API failed, using local only");
    }

    return { productId, quantity };
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      const userId = getUserId();
      if (userId && typeof window !== "undefined") {
        const stored = localStorage.getItem(`cart_${userId}`);
        if (stored) {
          const parsed: CartItem[] = JSON.parse(stored);
          state.items = parsed;
          state.totalQuantity = calculateTotalQuantity(parsed);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      const userId = getUserId();
      if (userId) localStorage.removeItem(`cart_${userId}`);
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.totalQuantity = calculateTotalQuantity(action.payload);
      const userId = getUserId();
      if (userId)
        localStorage.setItem(`cart_${userId}`, JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalQuantity = calculateTotalQuantity(state.items);

        const userId = getUserId();
        if (userId)
          localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
      })
      .addCase(fetchCartByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const existingItem = state.items.find((item) => item.id === productId);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          state.items.push({ id: productId, quantity });
        }

        state.totalQuantity = calculateTotalQuantity(state.items);
        const userId = getUserId();
        if (userId)
          localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
      });
  },
});

export const { hydrateCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
