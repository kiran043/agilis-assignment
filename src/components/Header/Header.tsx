"use client";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/app/store/slice/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { fetchCartByUser } from "@/app/store/slice/cartSlice";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";

export default function Header() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [mounted, setMounted] = useState(false);

    const { user } = useSelector((state: any) => state.auth);
    const { items, totalQuantity } = useSelector((state: any) => state.cart);



    console.log("useruser", user, items, totalQuantity)

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        Cookies.remove("token");
        Cookies.remove("userId");
        Cookies.remove("username");
        toast.success("Logout Successful");
        router.replace("/");
    };

    const userId = Cookies.get("userId");
    const userName = Cookies.get("username")

    useEffect(() => {
        if (mounted && userId) {
            localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
        }
    }, [items, mounted, userId]);






    if (!mounted) return null;

    return (
        <header className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-xl font-bold capitalize">{userName || "Agilis"}</span>
            </div>
            <div className="flex items-center gap-6">
                <button
                    className="relative"
                    onClick={async () => {
                        if (userId) {
                            await dispatch(fetchCartByUser(userId) as any);
                        }
                        router.push("/cart");
                    }}
                >
                    <FiShoppingCart size={30} />
                    {totalQuantity > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                            {totalQuantity}
                        </span>
                    )}
                </button>

                <button className="cursor-pointer" onClick={handleLogout}>
                    <MdOutlineLogout size={30} />
                </button>
            </div>
        </header>
    );
}
