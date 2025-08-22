"use client";

import { addToCart } from "@/app/store/slice/cartSlice";
import { AppDispatch } from "@/app/store/store";
import Image from "next/image";
import { useDispatch } from "react-redux";

type ProductCardProps = {
    id: any;
    name: string;
    description: string;
    price: number;
    image: string;
    onAddToCart?: (id: string | number) => void;
};

export default function ProductCard({
    id,
    name,
    description,
    price,
    image,
}: ProductCardProps) {
    const dispatch = useDispatch<AppDispatch>();
    return (
        <div className="flex flex-col border rounded-lg shadow-sm bg-white overflow-hidden">
            <div className="relative w-full h-48 flex items-center justify-center">
                <Image
                    src={image}
                    alt={name}
                    width={180}
                    height={120}
                    className="object-cover"
                    priority
                />

                <span className="absolute top-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                    ${price}
                </span>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base font-semibold">{name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

                <div className="mt-3 flex justify-start">
                    <button
                        onClick={() => dispatch(addToCart({ productId: id, quantity: 1 }))}
                        className="bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Add To Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
