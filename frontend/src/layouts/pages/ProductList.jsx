import { useContext, useEffect, useState } from "react";
import ProductCard from "../../components/products/ProductCard";
import { CartContext } from "../../context/cart-context";
import { fetchProducts } from "../../services/productApi";

const ProductList = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const items = await fetchProducts();
        if (active) setProducts(items);
      } catch (err) {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-80 rounded-3xl border border-slate-200 bg-white shadow-sm animate-pulse" />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
      </div>
    </div>
  );
};

export default ProductList;
