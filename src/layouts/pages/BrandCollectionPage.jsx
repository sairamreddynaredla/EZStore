import { useParams, useLocation } from "react-router-dom"
import { useState, useMemo, useEffect, useRef } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { products } from "../../data/products"
import { ezstoreProducts } from "../../data/ezstoreProducts"
import { brands } from "../../data/brands"
import ProductCard from "../../components/products/ProductCard"
import useCart from "../../hooks/usecart"
import { useWishlist } from "../../context/WishListContext"
import ShopSidebar from "../../components/shop/ShopSidebar"

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

export default function BrandCollectionPage(){
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
    (b) => {
      const slugMatch = String(b.slug ?? '').toLowerCase() === String(brandSlug ?? '').toLowerCase();
      const logoMatch = String(b.logo ?? '').toLowerCase() === String(brandSlug ?? '').toLowerCase();
      return slugMatch || logoMatch;
    }
  )

  const normalizedBrand = String(brandObj ? brandObj.name : brandSlug ?? '')
    .trim()
    .toLowerCase()

  const baseBrandProducts = useMemo(() => {
    const merged = [...products, ...(ezstoreProducts || [])]
    return merged.filter((p) => String(p.brand ?? '').trim().toLowerCase() === normalizedBrand)
  }, [normalizedBrand])

  const mergedAll = useMemo(() => {
    return [...products, ...(ezstoreProducts || [])]
  }, [])

  const relatedFallback = useMemo(() => {
    const needle = normalizedBrand;
    if (!needle) return [];
    return mergedAll.filter((p) => {
      const brandVal = String(p.brand || "").toLowerCase();
      const nameVal = String(p.name || "").toLowerCase();
      const tags = (p.tags || []).map(String).join(" ").toLowerCase();
      return brandVal.includes(needle) || nameVal.includes(needle) || tags.includes(needle);
    });
  }, [mergedAll, normalizedBrand]);

  const displayBaseBrandProducts = (baseBrandProducts && baseBrandProducts.length > 0) ? baseBrandProducts : relatedFallback.length > 0 ? relatedFallback : mergedAll

  const sidebarProducts = displayBaseBrandProducts

  const topCategory = useMemo(() => {
    const counts = {};
    displayBaseBrandProducts.forEach((p) => {
      const key = p.productCategory || 'Products';
      counts[key] = (counts[key] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries.length ? { title: entries[0][0], count: entries[0][1] } : { title: '', count: 0 };
  }, [displayBaseBrandProducts]);

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

  const productsRef = useRef(null);

  useEffect(() => {
    if (!brandObj) return;
    setFilters((prev) => ({ ...prev, brands: [brandObj.name] }));
  }, [brandObj]);

  useEffect(() => {
    if (!productsRef.current) return;
    try {
      productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -20);
    } catch (e) {}
  }, [displayedProducts.length, sortBy, filters, brandSlug]);

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

  function SortDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const options = [
      { value: 'best-selling', label: 'Best selling' },
      { value: 'low', label: 'Price: Low to High' },
      { value: 'high', label: 'Price: High to Low' },
      { value: 'new', label: 'New Release' },
      { value: 'discount', label: 'Discount: High to Low' },
    ];

    const currentLabel = options.find(o => o.value === value)?.label || 'Best selling';

    return (
      <div className="relative inline-block text-left">
        <button onClick={() => setOpen(!open)} className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-sm text-gray-700">Sort by :</span>
          <span className="font-semibold">{currentLabel}</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg border border-gray-100 z-50">
            {options.map((opt) => (
              <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }} className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-sm">{opt.label}</button>
            ))}
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold capitalize">
              {brandObj ? brandObj.name : brandSlug.replace(/-/g, " ")}
            </h1>
            <p className="text-gray-500 mt-2">{displayedProducts.length} Products Available</p>
          </div>
          <div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
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
            <ShopSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={() => setFilters((prev) => ({ ...DEFAULT_FILTERS, brands: brandObj ? [brandObj.name] : [] }))}
              products={sidebarProducts}
              sidebarTitle={topCategory.title}
              sidebarCount={topCategory.count}
            />
          </div>

          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
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

          {/* Right-hand brand spotlight removed per design */}
        </div>
      </div>

      <Footer />
    </div>
  )
}
