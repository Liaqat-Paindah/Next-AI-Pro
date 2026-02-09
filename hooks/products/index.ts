'use client'
import { ProductAPI } from "@/app/api/user/products";
import { useQuery } from "@tanstack/react-query";

export const useProduct = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: ProductAPI,
  });
};