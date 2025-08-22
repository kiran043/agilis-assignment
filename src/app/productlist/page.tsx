/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import ProductCard from "@/components/products/ProductCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slice/productSlice";
import Pagination from "@/lib/Pagination";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import Header from "@/components/Header/Header";
import { fetchCartByUser } from "../store/slice/cartSlice";
import Cookies from "js-cookie";


export default function ProductsPage() {
    const dispatch = useDispatch<any>();
    const { products, loading, error, total } = useSelector(
        (state: any) => state.products
    );

    const userId = Cookies.get("userId");
    const [page, setPage] = useState(1);
    const limit = 8;
    const totalPages = Math.ceil(total / limit);

    useEffect(() => {
        const skip = (page - 1) * limit;
        dispatch(fetchProducts({ limit, skip }));
        dispatch(fetchCartByUser(userId));
    }, [dispatch, page]);

    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <>
            <Header />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Products</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {loading
                        ?
                        Array.from({ length: limit }).map((_, idx) => (
                            <ProductSkeleton key={idx} />
                        ))
                        : products.map((product: any) => (
                            <ProductCard
                                key={product.id}
                                {...product}
                                image={product.thumbnail}
                                name={product.title}
                                description={product.description}
                                price={product.price}
                            />
                        ))}
                </div>

                {!loading && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </div>
        </>
    );
}
