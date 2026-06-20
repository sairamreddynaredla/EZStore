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

  // SHOW ONLY FIRST 4 PRODUCTS
  const bestSellerProducts = products.slice(0, 4);

  return (
    <section className="py-10 md:py-16 bg-[#f7f3ee]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* TOP */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4 sm:gap-8">
          <div>
            <p className="text-orange-500 text-xs sm:text-sm font-semibold uppercase tracking-[2px] sm:tracking-[3px] mb-1 md:mb-2">
              Trending Products
            </p>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-black mb-2 md:mb-3 whitespace-nowrap">Best Sellers</h2>

            <p className="text-gray-500 text-sm md:text-base">Explore our most loved products</p>
          </div>

          {/* VIEW ALL */}
          <Link to="/best-sellers" className="text-red-500 font-semibold hover:underline whitespace-nowrap text-sm md:text-base mt-2 sm:mt-0">
            View All
          </Link>
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
