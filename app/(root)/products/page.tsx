import React, { Suspense } from "react";
import Loading from "../loading";
import Product from "@/components/shared/products";

const Products = () => {
  return (
    <Suspense fallback={<Loading></Loading>}>
      <Product></Product>
    </Suspense>
  );
};

export default Products;
