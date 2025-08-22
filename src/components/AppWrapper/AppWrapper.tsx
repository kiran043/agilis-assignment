/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { hydrateCart, setCart } from "@/app/store/slice/cartSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state: any) => state.cart);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) router.replace("/login");
  }, [router]);

  const { token } = useSelector((state: any) => state.auth);


useEffect(() => {
  const userId = Cookies.get("userId");
  if (userId) {
    const stored = localStorage.getItem(`cart_${userId}`);
    if (stored) {
      dispatch(setCart(JSON.parse(stored)));
    }
  }
}, [dispatch]);
  

useEffect(() => {
    dispatch(hydrateCart());
  }, [dispatch]);


  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch(hydrateCart(JSON.parse(savedCart)));
    }
  }, [dispatch]);

  return (
    <>
      {children}
    </>
  );
}
