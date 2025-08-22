"use client";

export default function ProductSkeleton() {
  return (
    <div className="animate-pulse border rounded-lg p-4 shadow-sm">
      <div className="bg-gray-300 h-40 w-full rounded-md mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
    </div>
  );
}
