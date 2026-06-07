import { useContext } from "react";
import { products } from "../../data/products";
import ProductCard from "../../components/products/ProductCard";
import { CartContext } from "../../context/cart-context";

const ProductList = () => {
  const { addToCart } = useContext(CartContext);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
