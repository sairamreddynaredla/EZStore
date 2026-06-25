import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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

  // Show products for horizontal scroll
  const displayProducts = products.slice(0, 4);

  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const total = el.scrollWidth - el.clientWidth;
      if (total <= 0) return setActiveIndex(0);
      const progress = scrollLeft / total;
      const idx = Math.round(progress * (displayProducts.length - 1));
      setActiveIndex(idx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [displayProducts.length]);

  return (
    <section className="py-10 md:py-16 bg-[#f7f3ee]">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-6 lg:px-8">
        {/* TOP */}
        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between mb-6 md:mb-12 gap-4 sm:gap-8">
          <div className="text-left">
            <p className="text-orange-500 text-xs sm:text-sm font-semibold uppercase tracking-[2px] sm:tracking-[3px] mb-1 md:mb-2">
              Trending Products
            </p>

            <h2 className="text-lg sm:text-3xl md:text-4xl font-extrabold mb-0 md:mb-2 whitespace-nowrap">Best Sellers</h2>

            <p className="text-gray-500 text-sm md:text-base">Explore our most loved products</p>
          </div>

          {/* VIEW ALL */}
          <Link to="/best-sellers" className="text-red-500 font-semibold hover:underline whitespace-nowrap text-sm md:text-base mt-2 sm:mt-0">
            View All
          </Link>
        </div>

        {/* PRODUCTS - Mobile: grid (no horizontal scroll), Tablet: horizontal scroll, Laptop: grid */}

        {/* Mobile: Horizontal scroll carousel (mobile-only) */}
        <div className="sm:hidden">
          <div ref={containerRef} className="overflow-x-auto hide-scrollbar snap-x snap-mandatory -mx-4 px-4">
            <div className="flex gap-4 py-2">
              {displayProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[82%] sm:w-[40%] snap-center">
                  <ProductCard
                    compact
                    product={product}
                    onAddToCart={handleAddToCart}
                    onWishlistToggle={handleWishlistToggle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* no indicators on mobile */}
        </div>

        {/* Tablet (sm - lg): Horizontal Scroll */}
        <div className="hidden sm:block lg:hidden">
          <div ref={containerRef} className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-3 sm:gap-4 md:gap-6 pb-2 min-w-min px-2">
              {displayProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[35%] sm:w-[28%] md:w-[28%]">
                  <ProductCard
                    compact
                    product={product}
                    onAddToCart={handleAddToCart}
                    onWishlistToggle={handleWishlistToggle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* no indicators on tablet */}
        </div>

        {/* Laptop and Above: Grid Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {displayProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
