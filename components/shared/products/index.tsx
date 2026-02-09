"use client";
import Loading from "@/app/(root)/loading";
import { useProduct } from "@/hooks/products";
import React from "react";
import { toast } from "sonner";
import ProductList from "./ProductList";

const Products = () => {
  const { data: sample_data, isLoading, isError } = useProduct();
  if (isLoading) return <Loading></Loading>;
  if (isError) {
    toast.error(`the error is ${isError}`);
  }
  return (
    <div>
      <ProductList data={sample_data ?? []} title="New Title" limit={4} />
    </div>
  );
};

export default Products;
