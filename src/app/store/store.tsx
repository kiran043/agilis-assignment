import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slice/authSlice";
import productReducer from "../store/slice/productSlice";
import cartReducer from "../store/slice/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
