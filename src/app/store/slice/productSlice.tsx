"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
}

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (
      { limit, skip }: { limit: number; skip: number },
      { rejectWithValue }
    ) => {
      try {
        const res = await fetch(
          `${BASE_URL}/products?limit=${limit}&skip=${skip}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        return data;
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );
  


  const productSlice = createSlice({
    name: "products",
    initialState: {
      products: [] as any[],
      loading: false,
      error: null as string | null,
      total: 0,
      skip: 0,
      limit: 8,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchProducts.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload.products;
          state.total = action.payload.total;
          state.skip = action.payload.skip;
          state.limit = action.payload.limit;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  

export default productSlice.reducer;
