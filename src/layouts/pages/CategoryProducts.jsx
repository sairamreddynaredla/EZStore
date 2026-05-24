
import { useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../../components/Navbar"
import ProductCard from "../../components/products/ProductCard"
import ShopSidebar from "../../components/shop/ShopSidebar"
import { products } from "../../data/products"
import useCart from "../../hooks/usecart"
import { useWishlist } from "../../context/usewishlist"

const CategoryProducts = () => {

  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist } = useWishlist()

  const handleAddToCart = (product, quantity = 1) => {
    addToCart({ ...product, quantity })
  }

  const handleWishlistToggle = (product, isWishlisted) => {
    if (isWishlisted) {
      addToWishlist(product)
    } else {
      removeFromWishlist(product.id)
    }
  }

  const { category } = useParams()
  const [sortBy, setSortBy] = useState("best-selling")
  // Filter states
  const [filters, setFilters] = useState({
    brands: [],
    petTypes: [],
    flavors: [],
    weights: [],
    lifeStages: [],
    price: [0, 99999],
    includeOutOfStock: false,
    ratings: [],
    dealsOnly: false,
    foodForms: [],
    specialDiets: [],
  })

  // Get all products for this category
  const categoryProducts = useMemo(() => products.filter((item) => item.category === category), [category])

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((item) => {
      // Brand
      if (filters.brands.length && !filters.brands.includes(item.brand)) return false;
      // Pet Type
      if (filters.petTypes.length && !filters.petTypes.includes(item.pet)) return false;
      // Flavor
      if (filters.flavors.length && !filters.flavors.includes(item.flavor) && !filters.flavors.some(f => (item.flavor || '').includes(f))) return false;
      // Weight
      if (filters.weights.length) {
        const hasWeight = (item.variants || []).some(v => filters.weights.includes(v.weight));
        if (!hasWeight) return false;
      }
      // Life Stage
      if (filters.lifeStages.length && !filters.lifeStages.includes(item.lifeStage)) return false;
      // Food Form
      if (filters.foodForms.length && !filters.foodForms.includes(item.subCategory)) return false;
      // Special Diet
      if (filters.specialDiets.length) {
        const diets = [];
        if (item.subCategory && item.subCategory.toLowerCase().includes('grain')) diets.push('Grain Free');
        if (item.subCategory && item.subCategory.toLowerCase().includes('prescription')) diets.push('Prescription');
        if (!filters.specialDiets.some(diet => diets.includes(diet))) return false;
      }
      // Customer Review (Star Rating)
      if (filters.ratings.length && !filters.ratings.some(rating => Math.floor(item.rating) >= rating)) return false;
      // Deals & Discounts
      if (filters.dealsOnly) {
        const hasDiscount = (item.variants || []).some(v => v.originalPrice > v.price);
        if (!hasDiscount) return false;
      }
      // Price (at least one variant in range)
      if (filters.price && Array.isArray(item.variants)) {
        const inPrice = item.variants.some(v => v.price >= filters.price[0] && v.price <= filters.price[1]);
        if (!inPrice) return false;
      }
      // Out of stock
      if (!filters.includeOutOfStock && item.stock <= 0) return false;
      return true;
    }).sort((a, b) => {
      const aPrice = a.variants?.[0]?.price || 0;
      const bPrice = b.variants?.[0]?.price || 0;
      if (sortBy === "low") return aPrice - bPrice;
      if (sortBy === "high") return bPrice - aPrice;
      // Best selling fallback
      return (b.sales || 0) - (a.sales || 0);
    });
  }, [categoryProducts, filters, sortBy]);

  // Handler to update filters
  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      if (type === "price") return { ...prev, price: value };
      if (type === "includeOutOfStock") return { ...prev, includeOutOfStock: value };
      if (type === "dealsOnly") return { ...prev, dealsOnly: value };
      // Toggle for arrays
      const arr = prev[type] || [];
      return {
        ...prev,
        [type]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  return (

    <div className="bg-[#f8f8f8] min-h-screen">

      {/* NAVBAR */}

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* TOP SECTION */}

        <div className="flex items-center justify-between mb-10">

          {/* TITLE */}

          <div>

            <h1 className="text-4xl font-bold capitalize mt-20">
              {category.replace("-", " ")}
            </h1>

            <p className="text-gray-500 mt-2">
              {filteredProducts.length} Products Available
            </p>

          </div>

          {/* SORT */}

          <div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-5 py-3 outline-none shadow-sm"
            >

              <option value="best-selling">
                Best Selling
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>

            </select>

          </div>

        </div>

        {/* MAIN LAYOUT */}

        <div className="flex gap-8">

          {/* SIDEBAR */}

          <div className="w-[260px] shrink-0">
            <ShopSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={() => setFilters({
                brands: [],
                petTypes: [],
                flavors: [],
                weights: [],
                lifeStages: [],
                price: [0, 99999],
                includeOutOfStock: false,
                ratings: [],
                dealsOnly: false,
                foodForms: [],
                specialDiets: [],
              })}
              products={categoryProducts}
            />
          </div>

          {/* PRODUCTS */}

          <div className="flex-1">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

              {filteredProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onWishlistToggle={handleWishlistToggle}
                />

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}

export default CategoryProducts
