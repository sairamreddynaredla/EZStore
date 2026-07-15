import { useContext } from "react";
import { ProductContext } from "./Productcontext";

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
};
