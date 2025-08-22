/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartByUser } from "@/app/store/slice/cartSlice";
import Cookies from "js-cookie";
import Image from "next/image";

export default function CartPage() {
    const dispatch = useDispatch<any>();
    const { items, totalQuantity } = useSelector((state: any) => state.cart);

    const userId = Cookies.get("userId");

    useEffect(() => {
        if (userId) {
            dispatch(fetchCartByUser(userId));
        }
    }, [userId, dispatch]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

            {items.length === 0 ? (
                <p>No items in your cart</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map((item: any, index: any) => (
                            <div
                                key={index}
                                className="border p-4 rounded-lg shadow flex flex-col"
                            >
                                {item?.thumbnail ? (
                                    <Image
                                        src={item.thumbnail}
                                        alt={item?.title || "Product Image"}
                                        width={300}
                                        height={200}
                                        className="object-cover rounded-md mb-3"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm rounded-md mb-3">
                                        No Image
                                    </div>
                                )}

                                <h2 className="font-semibold mb-2">{item.title}</h2>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-xl font-bold mt-6">
                        Total Quantity: {totalQuantity}
                    </h2>
                </>
            )}
        </div>
    );
}
