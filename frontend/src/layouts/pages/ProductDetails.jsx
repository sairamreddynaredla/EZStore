import Navbar from "../../components/Navbar";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { products } from "../../data/products";
import customerCommerceApi from "../../services/customerCommerceApi";
import { useAuth } from "../../hooks/useAuth";

import ProductGallery from "../../components/productdetails/ProductGallery";
import ProductInfo from "../../components/productdetails/ProductInfo";
import BuyBox from "../../components/productdetails/BuyBox";
import DeliveryBox from "../../components/productdetails/DeliveryBox";
import SimilarProducts from "../../components/productdetails/SimilarProducts";
import useCart from "../../hooks/usecart";
import { useWishlist } from "../../context/usewishlist";
import SEO from "../../components/SEO";
import { normalizeFlavor } from "../../utils/productText";

const toProductSlug = (product) => {
  const value = product?.slug || product?.name || product?.title || "";
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const ProductDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const location = useLocation();

  const [openSection, setOpenSection] = useState("details");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // FIND PRODUCT — prefer router state when navigating from a product list to
  // avoid accidental collisions when product IDs are duplicated across
  // different sections of the data file. Fall back to lookup by `id` so
  // direct URLs still work.
  const productFromState = location?.state?.product;
  const product = productFromState ?? products.find((item) => item.id === Number(id));

  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || {});
  const [quantity, setQuantity] = useState(1);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [, setLoadingCommerce] = useState(false);
  const [commerceError, setCommerceError] = useState("");

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();

  const formatCategoryLabel = (category) => {
    if (!category) return "Unknown";
    return category
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const productCategoryLabel = product?.productCategory || formatCategoryLabel(product?.category);

  const handleAddToCart = async (productOrId, quantityValue = 1, showToast = true) => {
    const suppliedProduct =
      productOrId && typeof productOrId === "object" ? productOrId : null;
    const productToAdd = suppliedProduct || products.find((item) => item.id === Number(productOrId));

    if (!productToAdd) return;

    const safeQuantity = Math.max(1, Number(suppliedProduct?.quantity ?? quantityValue) || 1);
    await addToCart({
      ...productToAdd,
      selectedVariant: suppliedProduct?.selectedVariant ?? selectedVariant,
      quantity: safeQuantity,
      showToast,
    });
  };

  // BUY NOW HANDLER
  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        checkoutItem: {
          ...product,
          selectedVariant,
          quantity,
        },
      },
    });
  };

  const handleWishlistToggle = async (productId, isAdding) => {
    const productToUpdate = products.find((item) => item.id === Number(productId));
    if (!productToUpdate) return;

    if (isAdding) {
      await addToWishlist(productToUpdate);
    } else {
      await removeFromWishlist(productId, productToUpdate);
    }
  };

  // Wrapper for SimilarProducts to accept either product object or id
  const similarOnAddToCart = (productOrId, quantity = 1) => {
    if (!productOrId) return;
    if (typeof productOrId === "number" || typeof productOrId === "string") {
      const prod = products.find((p) => p.id === Number(productOrId));
      if (prod) addToCart({ ...prod, quantity });
    } else if (typeof productOrId === "object") {
      const prod = productOrId.id ? products.find((p) => p.id === Number(productOrId.id)) : null;
      // prefer using the passed object fully if it's complete
      if (productOrId && productOrId.name) {
        addToCart({ ...productOrId, quantity });
      } else if (prod) {
        addToCart({ ...prod, quantity });
      }
    }
  };

  const similarOnWishlistToggle = (productOrId, isAdding) => {
    if (!productOrId) return;
    const productToUpdate =
      typeof productOrId === "object"
        ? productOrId
        : products.find((item) => item.id === Number(productOrId));

    if (!productToUpdate) return;

    if (isAdding) addToWishlist(productToUpdate);
    else removeFromWishlist(productToUpdate.id, productToUpdate);
  };

  const lastViewedProductIdRef = useRef(null);

  const currentProductPrice = Number(
    selectedVariant?.price ?? product?.price ?? product?.variants?.[0]?.price ?? 0
  );

  useEffect(() => {
    if (!product?.id || !isAuthenticated || lastViewedProductIdRef.current === product.id) return;

    lastViewedProductIdRef.current = product.id;
    const trackView = async () => {
      try {
        setLoadingCommerce(true);
        await customerCommerceApi.trackRecentlyViewed({
          productId: Number(product.id),
          productSlug: toProductSlug(product) || undefined,
          productName: product.name,
          productImage: product.image || product.images?.[0],
          price: currentProductPrice,
          unitPrice: currentProductPrice,
        });
        const recentResponse = await customerCommerceApi.getRecentlyViewed();
        const items = Array.isArray(recentResponse?.data?.items) ? recentResponse.data.items : [];
        setRecentlyViewed(items);
      } catch (err) {
        setCommerceError(err?.response?.data?.message || "Unable to sync recently viewed");
      } finally {
        setLoadingCommerce(false);
      }
    };

    trackView();
  }, [isAuthenticated, product?.id, currentProductPrice]);

  const productStockStatus = useMemo(() => {
    if (product?.stock <= 0) return "Out of stock";
    if (product?.stock <= 5) return "Only a few left";
    return "In stock";
  }, [product?.stock]);

  // PRODUCT NOT FOUND
  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <Navbar />

        <div className="flex items-center justify-center h-[70vh]">
          <h1 className="text-4xl font-bold text-gray-700">Product Not Found</h1>
        </div>
      </div>
    );
  }

  // SIMILAR PRODUCTS
  const similarProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 6);

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <SEO
        title={product.name}
        description={product.description || `Buy ${product.name} online at EZStore`}
        image={product.images?.[0] || product.image}
        keywords={(product.tags || []).join(", ")}
        type="product"
      />
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE */}
      <div className="max-w-362.5 mx-auto px-4 md:px-6 py-6">
        {/* BREADCRUMB */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-8">
          <span>Home</span>

          <span>&gt;</span>

          <span>Products</span>

          <span>&gt;</span>

          <span className="capitalize">{productCategoryLabel}</span>

          <span>&gt;</span>

          <span className="text-black font-medium">{product.name}</span>
        </div>

        {/* PRODUCT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_0.7fr] gap-4 sm:gap-6 lg:gap-10 bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-100">
          {/* LEFT */}
          <div>
            <ProductGallery key={product.id} product={product} />
            <div className="mt-6 sm:mt-8">
              <DeliveryBox />
            </div>
          </div>

          {/* CENTER */}
          <div className="flex flex-col">
            <ProductInfo
              product={product}
              handleBuyNow={handleBuyNow}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              quantity={quantity}
              setQuantity={setQuantity}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={isInWishlist(product.id)}
              wishlistCount={wishlistCount}
              stockStatus={productStockStatus}
            />
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-28 self-start">
            <BuyBox
              product={product}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              quantity={quantity}
              setQuantity={setQuantity}
              addToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={isInWishlist(product.id)}
              stockStatus={productStockStatus}
            />
          </div>
        </div>

        {/* JSON-LD structured data for product (helps search engines) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.images || product.image || [],
            description: product.description,
            sku: product.sku || String(product.id),
            brand: { "@type": "Brand", name: product.brand },
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: product.variants?.[0]?.price || product.price || "0",
              availability:
                product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating || 0,
              reviewCount: product.reviews || 0,
            },
          })}
        </script>

        {/* ACCORDION */}
        <div className="mt-10 bg-white rounded-[35px] overflow-hidden border border-gray-200 shadow-sm">
          {/* DETAILS */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between px-6 py-4"
            >
              <span className="text-lg md:text-xl font-bold">Product Details</span>

              <span className="text-3xl font-light">{openSection === "details" ? "−" : "+"}</span>
            </button>

            {openSection === "details" && (
              <div className="px-6 pb-6 text-gray-600 leading-7 text-[15px]">
                <p>
                  {product.description ||
                    "Premium quality pet nutrition product specially designed for healthy growth, strong immunity, and daily wellness support for your pets."}
                </p>
              </div>
            )}
          </div>

          {/* INGREDIENTS */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("ingredients")}
              className="w-full flex items-center justify-between px-6 py-4"
            >
              <span className="text-lg md:text-xl font-bold">Ingredients</span>

              <span className="text-3xl font-light">
                {openSection === "ingredients" ? "−" : "+"}
              </span>
            </button>

            {openSection === "ingredients" && (
              <div className="px-6 pb-6">
                <ul className="space-y-3">
                  {product.ingredients?.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <span className="text-green-600 text-lg">✔</span>

                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => toggleSection("features")}
              className="w-full flex items-center justify-between px-6 py-4"
            >
              <span className="text-lg md:text-xl font-bold">Key Features</span>

              <span className="text-3xl font-light">{openSection === "features" ? "−" : "+"}</span>
            </button>

            {openSection === "features" && (
              <div className="px-6 pb-6 text-gray-700">
                <ul className="space-y-3 list-disc pl-5">
                  <li>High Protein Formula</li>
                  <li>Supports Healthy Digestion</li>
                  <li>Rich in Vitamins & Minerals</li>
                  <li>Premium Quality Ingredients</li>
                  <li>Suitable For Daily Feeding</li>
                </ul>
              </div>
            )}
          </div>

          {/* MORE INFO */}
          <div>
            <button
              onClick={() => toggleSection("more")}
              className="w-full flex items-center justify-between px-6 py-4"
            >
              <span className="text-lg md:text-xl font-bold">More Information</span>

              <span className="text-3xl font-light">{openSection === "more" ? "−" : "+"}</span>
            </button>

            {openSection === "more" && (
              <div className="px-6 pb-6 text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900">Brand:</span>
                      <span className="text-sm text-slate-600 text-right">{product.brand}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900">Pet Type:</span>
                      <span className="text-sm text-slate-600 text-right">
                        {product.pet || "Dog"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900">Life Stage:</span>
                      <span className="text-sm text-slate-600 text-right">
                        {product.lifeStage || "Adult"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900">Category:</span>
                      <span className="text-sm text-slate-600 text-right wrap-break-word">
                        {productCategoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900">Flavor:</span>
                      <span className="text-sm text-slate-600 text-right">
                        {normalizeFlavor(product.flavor)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {commerceError && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{commerceError}</div>}

        {recentlyViewed.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <p className="text-orange-500 uppercase tracking-[3px] text-sm font-semibold">Recently viewed</p>
              <h2 className="text-4xl font-black mt-2">Continue where you left off</h2>
            </div>
            <SimilarProducts products={recentlyViewed.map((item) => {
              const catalogProduct = products.find(
                (catalogItem) => Number(catalogItem.id) === Number(item.productId ?? item.product?.id ?? item.id)
              );
              const savedPrice = [item.productPrice, item.unitPrice, item.product?.price, item.price]
                .map(Number)
                .find((price) => Number.isFinite(price) && price > 0);

              return {
                ...item,
                id: item.productId ?? item.product?.id ?? item.id,
                name: item.productName ?? item.product?.name ?? item.name,
                image: item.productImage ?? item.product?.imageUrl ?? item.image,
                price: savedPrice ?? catalogProduct?.variants?.[0]?.price ?? catalogProduct?.price ?? 0,
              };
            })} onAddToCart={similarOnAddToCart} onWishlistToggle={similarOnWishlistToggle} />
          </div>
        )}

        {/* RELATED PRODUCTS */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <p className="text-orange-500 uppercase tracking-[3px] text-sm font-semibold">
                Recommended Products
              </p>

              <h2 className="text-4xl font-black mt-2">You May Also Like</h2>
            </div>

            <SimilarProducts
              products={similarProducts}
              onAddToCart={similarOnAddToCart}
              onWishlistToggle={similarOnWishlistToggle}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
