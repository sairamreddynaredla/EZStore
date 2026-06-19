import { Link } from "react-router-dom";
import products from "../../data/products";
import ProductCard from "../products/ProductCard";
import useCart from "../../hooks/usecart";
import { useWishlist } from "../../context/usewishlist";

const BestSellerSection = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();

  const handleAddToCart = (product, quantity = 1) => {
    addToCart({ ...product, quantity });
  };

  const handleWishlistToggle = (product, isWishlisted) => {
    if (isWishlisted) {
      addToWishlist(product);
    } else {
      removeFromWishlist(product.id);
    }
  };

  // SHOW ONLY FIRST 5 PRODUCTS
  const bestSellerProducts = products.slice(0, 5);

  return (
    <section className="py-14 bg-[#f7f3ee]">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* TOP */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-orange-500 text-sm font-semibold uppercase tracking-[3px]">
              Trending Products
            </p>

            <h2 className="text-4xl font-black mt-2">Best Sellers</h2>

            <p className="text-gray-500 mt-2">Explore our most loved products</p>
          </div>

          {/* VIEW ALL */}
          <Link to="/best-sellers" className="text-red-500 font-semibold hover:underline">
            View All
          </Link>
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
          {bestSellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
