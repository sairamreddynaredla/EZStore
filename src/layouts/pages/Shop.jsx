import { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";

import Navbar from "../../components/Navbar";
import SEO from "../../components/SEO";
import ShopSidebar from "../../components/shop/ShopSidebar";
import ProductGrid from "../../components/products/ProductGrid";
import ProductSort from "../../components/products/ProductSort";
import ProductSearch from "../../components/products/ProductSearch";

import { products } from "../../data/products";
import useCart from "../../hooks/usecart";
import { useWishlist } from "../../context/WishListContext";

const Shop = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();

  // WISHLIST TOGGLE HANDLER
  const handleWishlistToggle = (product, isAdding) => {
    if (isAdding) {
      addToWishlist(product);
    } else {
      removeFromWishlist(product.id);
    }
  };

  // ADD TO CART HANDLER
  const handleAddToCart = async (product, quantity) => {
    if (product) {
      addToCart({ ...product, quantity });
    }
  };

  // URL PARAMS
  const queryParams = new URLSearchParams(location.search);

  const searchParam = queryParams.get("search");

  const saleParam = queryParams.get("sale");

  // SEARCH
  const [search, setSearch] = useState(() => searchParam || "");

  // Keep `search` state in sync when the URL query changes (e.g., from Navbar navigate)
  useEffect(() => {
    setSearch(searchParam || "");
  }, [searchParam]);

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

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // SORT
  const [sort, setSort] = useState("featured");
  // FILTER STATES
  const [selectedPet, setSelectedPet] = useState("all");

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      if (type === "price") return { ...prev, price: value };
      if (type === "includeOutOfStock") return { ...prev, includeOutOfStock: value };
      if (type === "dealsOnly") return { ...prev, dealsOnly: value };

      const arr = prev[type] || [];
      return {
        ...prev,
        [type]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  let filtered = products.filter((product) => {
    const searchValue = search.toLowerCase();
    const matchesSearch =
      String(product.name ?? "")
        .toLowerCase()
        .includes(searchValue) ||
      String(product.brand ?? "")
        .toLowerCase()
        .includes(searchValue) ||
      String(product.category ?? "")
        .toLowerCase()
        .includes(searchValue) ||
      String(product.pet ?? "")
        .toLowerCase()
        .includes(searchValue);

    const matchesPet = selectedPet === "all" ? true : product.pet === selectedPet;

    const matchesSale = filters.dealsOnly
      ? (product.variants || []).some((variant) => variant.originalPrice > variant.price)
      : true;

    const matchesAvailability = filters.includeOutOfStock ? true : (product.stock ?? 1) > 0;

    const matchesProductCategories = filters.productCategories.length
      ? filters.productCategories.includes(product.productCategory)
      : true;

    const matchesBrands = filters.brands.length ? filters.brands.includes(product.brand) : true;

    const matchesBreedSize = filters.breedSizes.length
      ? filters.breedSizes.includes(product.breedSize)
      : true;

    const matchesFlavor = filters.flavors.length ? filters.flavors.includes(product.flavor) : true;

    const matchesPetLifeStages = filters.lifeStages.length
      ? filters.lifeStages.includes(product.lifeStage)
      : true;

    const productWeights = Array.isArray(product.weight)
      ? product.weight
      : product.weight
        ? [product.weight]
        : [];
    const variantWeights = (product.variants || [])
      .map((variant) => variant.weight)
      .filter(Boolean);
    const matchesWeight = filters.weights.length
      ? [...productWeights, ...variantWeights].some((weight) => filters.weights.includes(weight))
      : true;

    const matchesRatings = filters.ratings.length
      ? filters.ratings.some((rating) => Math.floor(product.rating || 0) >= rating)
      : true;

    const matchesVegTypes = filters.vegTypes.length
      ? filters.vegTypes.includes(product.vegType)
      : true;

    const matchesSizes = filters.sizes.length ? filters.sizes.includes(product.size) : true;

    const matchesSpecialDiets = filters.specialDiets.length
      ? filters.specialDiets.some((diet) =>
          String(product.specialDiet || "")
            .toLowerCase()
            .includes(diet.toLowerCase())
        )
      : true;

    const matchesProductTypes = filters.productTypes.length
      ? filters.productTypes.includes(product.subCategory)
      : true;

    const matchesPrice = Array.isArray(filters.price)
      ? (product.variants || []).some((variant) => variant.price <= Number(filters.price[1]))
      : true;

    return (
      matchesSearch &&
      matchesPet &&
      matchesSale &&
      matchesAvailability &&
      matchesProductCategories &&
      matchesBrands &&
      matchesBreedSize &&
      matchesFlavor &&
      matchesPetLifeStages &&
      matchesWeight &&
      matchesRatings &&
      matchesVegTypes &&
      matchesSizes &&
      matchesSpecialDiets &&
      matchesProductTypes &&
      matchesPrice
    );
  });

  // SORTING
  if (sort === "priceLow") {
    filtered = [...filtered].sort((a, b) => a.variants[0].price - b.variants[0].price);
  }

  if (sort === "priceHigh") {
    filtered = [...filtered].sort((a, b) => b.variants[0].price - a.variants[0].price);
  }

  if (sort === "new") {
    filtered = [...filtered].sort((a, b) => b.id - a.id);
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <SEO
        title="Shop"
        description="Browse our wide selection of premium pet food and supplies."
        keywords="pet shop, pet supplies, dog food, cat food"
      />
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE */}
      <div className="max-w-360 mx-auto px-4 md:px-8 py-12">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-bold text-[#0D2B5C] mb-3">Pet Food Shop</h1>

            <p className="text-gray-500 text-lg max-w-3xl">
              Explore premium pet food products for dogs, cats, birds, fish, rabbits, hamsters, and
              more.
            </p>
          </div>

          {/* SEARCH + SORT */}
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <ProductSearch value={search} onChange={(e) => setSearch(e.target.value)} />

            <ProductSort sort={sort} onSort={setSort} />
          </div>
        </div>

        {/* QUICK FILTERS */}
        <div className="flex flex-wrap gap-4 mb-10">
          {["all", "Dog", "Cat", "Fish", "Bird", "Rabbit", "Hamster"].map((pet) => (
            <button
              key={pet}
              onClick={() => setSelectedPet(pet)}
              className={`

                px-6
                py-3
                rounded-full
                font-semibold
                transition-all

                ${
                  selectedPet === pet
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white hover:bg-orange-100 text-[#0D2B5C]"
                }
              `}
            >
              {pet}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex gap-8">
          {/* SIDEBAR */}
          <div className="hidden xl:block w-75 shrink-0">
            <ShopSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              products={products}
            />
          </div>

          {/* PRODUCTS */}
          <div className="flex-1">
            {/* RESULTS */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <p className="text-gray-500 text-lg">{filtered.length} Products Found</p>

              {saleParam === "true" && (
                <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold text-sm">
                  Sale Products
                </div>
              )}
            </div>

            {/* GRID */}
            <ProductGrid
              products={filtered}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
