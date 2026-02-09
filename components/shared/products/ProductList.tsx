import React from "react";

type Product = {
  name: string;
};

export type ProductListProps = {
  data: Product[];
  title?: string;
  limit?: number;
};

const ProductList = ({ data, title, limit }: ProductListProps) => {
  const limit_data = limit ? data.slice(0, limit) : data;
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No products available.</p>;
  }
  return (
    <div>
      <span>{title}</span>
      {limit_data.map((product, index) => (
        <span key={index} className="">
          {product.name}
        </span>
      ))}
    </div>
  );
};

export default ProductList;
