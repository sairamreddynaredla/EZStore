
import { useParams, useLocation } from "react-router-dom"
import { useState, useMemo } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { products } from "../../data/products"
import { applodProducts } from "../../data/applodProducts"
import { ezstoreProducts } from "../../data/ezstoreProducts"
import { brands } from "../../data/brands"
import ProductCard from "../../components/products/ProductCard"
import useCart from "../../hooks/usecart"
import { useWishlist } from "../../context/WishListContext"
import ShopSidebar from "../../components/shop/ShopSidebar"
import BrandSidebar from "../../components/BrandSidebar"

const DEFAULT_FILTERS = {
  brands: [],
  petTypes: [],
  productCategories: [],
  productTypes: [],
  flavors: [],
  weights: [],
  lifeStages: [],
  breedSizes: [],
  sizes: [],
  vegTypes: [],
  price: [0, 99999],
  includeOutOfStock: false,
  ratings: [],
  dealsOnly: false,
  specialDiets: [],
};

const BrandProducts = () => {
  const { brandSlug } = useParams()
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preset = params.get('preset') || null;

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();

  const [sortBy, setSortBy] = useState("best-selling")
  const [filters, setFilters] = useState(() => {
    if (preset === 'dog-puppy-food') {
      return {
        ...DEFAULT_FILTERS,
        petTypes: ['Dog'],
        lifeStages: ['Puppy'],
        productCategories: ['Dog Food'],
      };
    }
    return DEFAULT_FILTERS;
  })
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const brandObj = brands.find(
    (b) => String(b.logo ?? '').toLowerCase() === String(brandSlug ?? '').toLowerCase()
  )

  const normalizedBrand = String(brandObj ? brandObj.name : brandSlug ?? '')
    .trim()
    .toLowerCase()

  const baseBrandProducts = useMemo(() => {
    const merged = [...products, ...(applodProducts || []), ...(ezstoreProducts || [])]
    return merged.filter((p) => String(p.brand ?? '').trim().toLowerCase() === normalizedBrand)
  }, [normalizedBrand])

  const mergedAll = useMemo(() => {
    return [...products, ...(applodProducts || []), ...(ezstoreProducts || [])]
  }, [])

  const displayBaseBrandProducts = (baseBrandProducts && baseBrandProducts.length > 0) ? baseBrandProducts : mergedAll

  const sidebarProducts = displayBaseBrandProducts

  const filteredProducts = useMemo(() => {
    return displayBaseBrandProducts
      .filter((item) => {
        if (filters.brands.length && !filters.brands.includes(item.brand)) return false;
        if (filters.petTypes.length && !filters.petTypes.includes(item.pet)) return false;
        if (filters.flavors.length) {
          const itemFlavor = item.flavor || "";
          if (!filters.flavors.some((f) => itemFlavor.toLowerCase().includes(f.toLowerCase()))) return false;
        }
        if (filters.weights.length) {
          const hasWeight = (item.variants || []).some((v) => filters.weights.includes(v.weight));
          if (!hasWeight) return false;
        }
        if (filters.lifeStages.length && !filters.lifeStages.includes(item.lifeStage)) return false;
        if (filters.breedSizes.length && !filters.breedSizes.includes(item.breedSize)) return false;
        if (filters.productTypes.length && !filters.productTypes.includes(item.subCategory)) return false;
        if (filters.productCategories.length && !filters.productCategories.includes(item.productCategory)) return false;
        if (filters.sizes.length && !filters.sizes.includes(item.size)) return false;
        if (filters.vegTypes.length && !filters.vegTypes.includes(item.vegType)) return false;
        if (filters.specialDiets.length) {
          const itemDiet = (item.specialDiet || "").toLowerCase();
          const match = filters.specialDiets.some((diet) =>
            itemDiet === diet.toLowerCase() || itemDiet.includes(diet.toLowerCase())
          );
          if (!match) return false;
        }
        if (filters.ratings.length) {
          if (!filters.ratings.some((r) => Math.floor(item.rating || 0) >= r)) return false;
        }
        if (filters.dealsOnly) {
          const hasDiscount = (item.variants || []).some((v) => v.originalPrice > v.price);
          if (!hasDiscount) return false;
        }
        if (filters.price && Array.isArray(item.variants)) {
          const upperBound = Array.isArray(filters.price) ? Number(filters.price[1]) : Number(filters.price);
          const inPrice = item.variants.some((v) => v.price <= upperBound);
          if (!inPrice) return false;
        }
        if (!filters.includeOutOfStock && (item.stock ?? 1) <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        const aPrice = a.variants?.[0]?.price || 0;
        const bPrice = b.variants?.[0]?.price || 0;
        if (sortBy === "low")  return aPrice - bPrice;
        if (sortBy === "high") return bPrice - aPrice;
        return (b.soldCount || 0) - (a.soldCount || 0);
      });
  }, [displayBaseBrandProducts, filters, sortBy]);

  const handleAddToCart = (product, quantity = 1) => {
    addToCart({ ...product, quantity });
  };

  const handleWishlistToggle = (product, isAdding) => {
    if (isAdding) addToWishlist(product);
    else removeFromWishlist(product.id);
  };

  const DISPLAY_LIMIT = 20;
  const displayedProducts = filteredProducts.slice(0, DISPLAY_LIMIT);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      if (type === "price")            return { ...prev, price: value };
      if (type === "includeOutOfStock") return { ...prev, includeOutOfStock: value };
      if (type === "dealsOnly")        return { ...prev, dealsOnly: value };
      const arr = prev[type] || [];
      return {
        ...prev,
        [type]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold capitalize">
              {brandObj ? brandObj.name : brandSlug.replace(/-/g, " ")}
            </h1>
            <p className="text-gray-500 mt-2">{displayedProducts.length} Products Available</p>
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-5 py-3 outline-none shadow-sm"
            >
              <option value="best-selling">Best Selling</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden w-full px-4 py-2 bg-[#1F6B52] text-white rounded-lg font-semibold flex items-center justify-center gap-2 mb-4"
            aria-expanded={isMobileFilterOpen}
          >
            <span>{isMobileFilterOpen ? "✕" : "☰"}</span>
            {isMobileFilterOpen ? "Close Filters" : "Show Filters"}
          </button>

          {isMobileFilterOpen && (
            <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={() => setIsMobileFilterOpen(false)} />
          )}

          {isMobileFilterOpen && (
            <div className="fixed left-0 top-0 z-50 w-72 h-screen overflow-y-auto pt-20 md:hidden">
              <ShopSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={() => setFilters(DEFAULT_FILTERS)}
                products={sidebarProducts}
              />
            </div>
          )}

          <div className="w-65 shrink-0 md:block hidden">
            {preset === 'dog-puppy-food' ? (
              <ShopSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={() => setFilters(DEFAULT_FILTERS)}
                products={sidebarProducts}
              />
            ) : (
              <BrandSidebar selectedBrand={brandObj ? (brandObj.slug || brandObj.logo) : brandSlug} />
            )}
          </div>

          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[20px] p-12 text-center">
                <p className="text-gray-500 text-lg">No products found for this brand.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BrandProducts