import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { Link } from "react-router-dom";

import { FaHeart } from "react-icons/fa";
import { resolveProductImage, resolveProductImageFallback } from "../../utils/productImage";

import { useWishlist } from "../../context/WishListContext";

import useCart from "../../hooks/usecart";
import AddToCartButton from "../../components/products/AddToCartButton";
import { normalizeWishlistItem } from "../../utils/wishlist";

const WishList = () => {
  const { wishlist: wishlistItems, removeFromWishlist, loading, error } = useWishlist();

  const { addToCart } = useCart();

  const handleAddToCart = (product, quantity) => {
    addToCart({ ...product, quantity });
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE */}
      <div className="max-w-360 mx-auto px-5 md:px-10 py-16">
        {/* TITLE */}
        <div className="flex items-center justify-between mb-12 flex-wrap gap-5">
          <div>
            <h1 className="text-5xl font-bold text-[#0D2B5C] mb-3">My Wishlist</h1>

            <p className="text-gray-500 text-lg">Save your favorite pet products for later.</p>
          </div>

          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm">
            <span className="text-lg font-semibold text-[#0D2B5C]">
              {wishlistItems.length} Items
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600 shadow-sm">
            Syncing your wishlist with your account...
          </div>
        )}

        {!loading && wishlistItems.length === 0 ? (
          <div className="bg-white rounded-[35px] p-20 text-center shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                <FaHeart className="text-red-500" size={40} />
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-5 text-[#0D2B5C]">Your Wishlist Is Empty</h2>

            <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
              Save products you love and easily find them later.
            </p>

            <Link
              to="/shop"
              className="inline-block bg-orange-500 hover:bg-orange-600 transition-all text-white px-10 py-5 rounded-full text-lg font-semibold"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Your wishlist is synced and ready for checkout.
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {wishlistItems.map((product) => {
              const normalizedProduct = normalizeWishlistItem(product);
              const productForDetails = normalizedProduct.catalogProduct
                ? { ...normalizedProduct.catalogProduct, selectedVariant: normalizedProduct.selectedVariant }
                : normalizedProduct;
              const activeVariant = normalizedProduct.selectedVariant || {
                price: normalizedProduct.price,
                originalPrice: normalizedProduct.originalPrice,
              };

              const discountPercentage =
                activeVariant?.originalPrice > activeVariant?.price
                  ? Math.round(
                      ((activeVariant.originalPrice - activeVariant.price) /
                        activeVariant.originalPrice) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={normalizedProduct.wishlistItemId ?? normalizedProduct.id ?? product.id}
                  className="
                    group
                    bg-white
                    rounded-xl
                    overflow-hidden
                    shadow-sm
                    hover:shadow-2xl
                    transition-all
                    duration-500
                    border
                    border-gray-100
                    flex
                    flex-col
                  "
                >
                  {/* IMAGE */}
                  <div className="relative aspect-square sm:h-44 lg:h-52 bg-white overflow-hidden px-3 pt-2 pb-1">
                    {/* DISCOUNT */}
                    {discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 z-10 bg-[#F53B3B] text-white px-2 py-1 rounded text-[10px] font-bold tracking-wide">
                        {discountPercentage}% OFF
                      </div>
                    )}

                    {/* REMOVE */}
                    <button
                      onClick={() => removeFromWishlist(normalizedProduct.id ?? product.id)}
                      className="
                        absolute
                        top-2
                        right-2
                        z-10
                        bg-white
                        w-10
                        h-10
                        rounded-full
                        flex
                        items-center
                        justify-center
                        shadow-sm
                        hover:bg-red-500
                        hover:text-white
                        transition-all
                        text-red-500
                      "
                    >
                      <FaHeart />
                    </button>

                    {/* PRODUCT IMAGE */}
                    <Link to={`/product/${productForDetails.id}`} state={{ product: productForDetails }} className="block w-full h-full">
                      <img
                        src={resolveProductImage(normalizedProduct)}
                        alt={normalizedProduct.name}
                        className="
                          w-full
                          h-full
                          object-contain
                          p-2
                          group-hover:scale-105
                          transition-transform
                          duration-700
                        "
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          const fallback = resolveProductImageFallback(normalizedProduct);
                          if (e.currentTarget.src !== fallback) {
                            e.currentTarget.src = fallback;
                          }
                        }}
                      />
                    </Link>
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col flex-1 px-3 pt-1 pb-2">
                    {/* BRAND */}
                    <p className="text-[12px] text-gray-500 mb-1 font-medium truncate">
                      {normalizedProduct.brand}
                    </p>

                    {/* TITLE */}
                    <Link to={`/product/${productForDetails.id}`} state={{ product: productForDetails }}>
                      <h2
                        className="
                          text-sm
                          font-semibold
                          text-[#0D2B5C]
                          leading-tight
                          overflow-hidden
                          min-h-10
                          hover:text-[#F53B3B]
                          transition-all
                        "
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {normalizedProduct.name}
                      </h2>
                    </Link>

                    {/* RATING */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>

                        <span className="font-semibold text-sm text-gray-800">
                          {normalizedProduct.rating}
                        </span>
                      </div>

                      <span className="text-gray-400 text-sm">({normalizedProduct.reviews})</span>
                    </div>

                    {/* PRICE */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <h3 className="text-lg sm:text-[18px] font-bold text-gray-900">${activeVariant.price}</h3>

                      <span className="text-gray-400 line-through text-[12px]">
                        ${activeVariant.originalPrice}
                      </span>
                    </div>

                    {/* ADD TO CART BUTTON */}
                    <AddToCartButton
                      product={{ ...productForDetails, selectedVariant: activeVariant }}
                      isOutOfStock={normalizedProduct.stock <= 0}
                      onAddToCart={(prod, quantity) => {
                        handleAddToCart(prod, quantity);
                        removeFromWishlist(normalizedProduct.id ?? product.id);
                      }}
                      quantity={1}
                      btnClass="w-full mt-auto pt-2 py-3 rounded-xl text-sm font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-white"
                    />
                  </div>
                </div>
              );
            })}
            </div>
          </>
        )}
      </div>
      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default WishList;
