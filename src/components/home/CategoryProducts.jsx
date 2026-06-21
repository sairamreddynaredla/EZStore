import { useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/products/ProductCard";
import ShopSidebar from "../../components/shop/ShopSidebar";
import CategoryHero from "../../components/category/CategoryHero";
import { products } from "../../data/products";
import { dogCategories } from "../../data/dogCategories";
import { catCategories } from "../../data/catCategories";
import { categoryBanners } from "../../data/categoryBanners";
import { getCategoryBannerKey } from "../../utils/categoryBannerKey";
import useCart from "../../hooks/usecart";
import { useWishlist } from "../../context/usewishlist";

// Default (empty) filter state — single source of truth used for init + clear
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

const CategoryProducts = ({ petType }) => {
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

  const params = useParams();
  const location = useLocation();
  const slug = params.slug || params.category || params.categorySlug || params["*"];

  const getPetFromPath = (pathname) => {
    if (!pathname) return null;
    const normalizedPath = pathname.toLowerCase();
    if (normalizedPath.startsWith("/dogs/")) return "Dog";
    if (normalizedPath.startsWith("/cats/")) return "Cat";
    return null;
  };

  const [sortBy, setSortBy] = useState("best-selling");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // ── Slug / pet resolution ──────────────────────────────────────────────
  const genericPetCategoryMap = {
    "dog-food": "Dog",
    "cat-food": "Cat",
    "bird-food": "Bird",
    "fish-food": "Fish",
    "rabbit-food": "Rabbit",
    "hamster-food": "Hamster",
  };

  const getPetFromSlug = (slugValue) => {
    if (!slugValue) return null;
    const normalized = slugValue.toLowerCase();
    if (normalized.startsWith("dogs-")) return "Dog";
    if (normalized.startsWith("cats-")) return "Cat";
    return genericPetCategoryMap[normalized] || null;
  };

  const effectivePet = petType || getPetFromSlug(slug) || getPetFromPath(location.pathname);
  const isTopLevelPetCategory =
    slug && Object.prototype.hasOwnProperty.call(genericPetCategoryMap, slug.toLowerCase());
  const normalizedSlug = isTopLevelPetCategory
    ? slug
    : effectivePet
      ? slug.replace(/^(dogs-|cats-)/, "")
      : slug;

  const getTopLevelProductCategory = (slugValue) => {
    if (!slugValue) return null;
    return slugValue.replace(/-/g, " ").trim().toLowerCase();
  };

  // ── Base product set for this category ────────────────────────────────
  const categoryProducts = useMemo(() => {
    if (effectivePet) {
      if (isTopLevelPetCategory) {
        const targetCategory = `${effectivePet} Food`.toLowerCase();
        return products.filter(
          (item) =>
            item.pet === effectivePet &&
            item.productCategory?.toLowerCase().includes(targetCategory)
        );
      }
      return products.filter(
        (item) =>
          item.pet === effectivePet &&
          (item.subCategory === normalizedSlug ||
            item.subCategory?.replace(/-/g, "") === normalizedSlug.replace(/-/g, ""))
      );
    }

    const topLevelCategory = getTopLevelProductCategory(slug);
    if (topLevelCategory) {
      const topLevelMatches = products.filter(
        (item) => item.productCategory?.toLowerCase() === topLevelCategory
      );
      if (topLevelMatches.length) return topLevelMatches;
    }

    return products.filter((item) => item.category === slug);
  }, [effectivePet, isTopLevelPetCategory, normalizedSlug, slug]);

  // ── Cat fallback ───────────────────────────────────────────────────────
  const getRelatedCatProducts = (slugValue) => {
    const catFallbackMap = {
      "meaty-treats": {
        category: "cats-treats",
        productTypeIncludes: ["Meaty", "Treats"],
      },
      "crunchy-treats": {
        category: "cats-treats",
        productTypeIncludes: ["Crunchy", "Treats"],
      },
      "creamy-treats": {
        category: "cats-treats",
        productTypeIncludes: ["Creamy", "Treats"],
      },
      "prescription-food": {
        category: "cats-dry-food",
        specialDietIncludes: ["Prescription", "Special"],
      },
    };

    const fillToLimit = (items, limit = 10) => {
      const selected = [...items];
      const ids = new Set(selected.map((item) => item.id));
      if (selected.length >= limit) return selected.slice(0, limit);
      const extras = products
        .filter((item) => item.pet === "Cat" && !ids.has(item.id))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
      for (const item of extras) {
        if (selected.length >= limit) break;
        selected.push(item);
      }
      return selected;
    };

    const config = catFallbackMap[slugValue];
    if (!config) return fillToLimit(products.filter((item) => item.pet === "Cat"));

    let related = products.filter((item) => item.pet === "Cat");
    if (config.category) related = related.filter((item) => item.category === config.category);
    if (config.productTypeIncludes) {
      related = related.filter((item) =>
        config.productTypeIncludes.some(
          (term) =>
            item.productType?.toLowerCase().includes(term.toLowerCase()) ||
            item.name?.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    if (config.specialDietIncludes) {
      related = related.filter((item) =>
        config.specialDietIncludes.some(
          (term) =>
            item.specialDiet?.toLowerCase().includes(term.toLowerCase()) ||
            item.productType?.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    if (related.length === 0 && config.category) {
      related = products.filter((item) => item.pet === "Cat" && item.category === config.category);
    }
    return fillToLimit(related);
  };

  const categoryProductsWithFallback = useMemo(() => {
    if (categoryProducts.length) return categoryProducts;
    if (effectivePet === "Cat" && normalizedSlug) return getRelatedCatProducts(normalizedSlug);
    return categoryProducts;
  }, [categoryProducts, effectivePet, normalizedSlug]);

  const relatedProducts = useMemo(() => {
    if (categoryProducts.length) return [];
    return categoryProductsWithFallback.slice(0, 10);
  }, [categoryProducts.length, categoryProductsWithFallback]);

  const sidebarProducts = categoryProducts.length ? categoryProducts : categoryProductsWithFallback;

  // ── Filtered + sorted products ─────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((item) => {
        // Brand
        if (filters.brands.length && !filters.brands.includes(item.brand)) return false;

        // Pet Type
        if (filters.petTypes.length && !filters.petTypes.includes(item.pet)) return false;

        // Flavor
        if (filters.flavors.length) {
          const itemFlavor = item.flavor || "";
          if (!filters.flavors.some((f) => itemFlavor.toLowerCase().includes(f.toLowerCase())))
            return false;
        }

        // Weight (variant-level)
        if (filters.weights.length) {
          const hasWeight = (item.variants || []).some((v) => filters.weights.includes(v.weight));
          if (!hasWeight) return false;
        }

        // Life Stage
        if (filters.lifeStages.length && !filters.lifeStages.includes(item.lifeStage)) return false;

        // Breed Size  ← was missing, now fixed
        if (filters.breedSizes.length && !filters.breedSizes.includes(item.breedSize)) return false;

        // Product Type (subCategory)
        if (filters.productTypes.length && !filters.productTypes.includes(item.subCategory))
          return false;

        // Product Category
        if (
          filters.productCategories.length &&
          !filters.productCategories.includes(item.productCategory)
        )
          return false;

        // Size
        if (filters.sizes.length && !filters.sizes.includes(item.size)) return false;

        // Veg / Non-Veg
        if (filters.vegTypes.length && !filters.vegTypes.includes(item.vegType)) return false;

        // Special Diet  ← now uses actual `specialDiet` field (not just subCategory)
        if (filters.specialDiets.length) {
          const itemDiet = (item.specialDiet || "").toLowerCase();
          const match = filters.specialDiets.some(
            (diet) => itemDiet === diet.toLowerCase() || itemDiet.includes(diet.toLowerCase())
          );
          if (!match) return false;
        }

        // Customer Rating
        if (filters.ratings.length) {
          if (!filters.ratings.some((r) => Math.floor(item.rating || 0) >= r)) return false;
        }

        // Deals & Discounts
        if (filters.dealsOnly) {
          const hasDiscount = (item.variants || []).some((v) => v.originalPrice > v.price);
          if (!hasDiscount) return false;
        }

        // Price range (at least one variant in range)
        if (filters.price && Array.isArray(item.variants)) {
          const inPrice = item.variants.some(
            (v) => v.price >= filters.price[0] && v.price <= filters.price[1]
          );
          if (!inPrice) return false;
        }

        // Availability / out of stock
        if (!filters.includeOutOfStock && (item.stock ?? 1) <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        const aPrice = a.variants?.[0]?.price || 0;
        const bPrice = b.variants?.[0]?.price || 0;
        if (sortBy === "low") return aPrice - bPrice;
        if (sortBy === "high") return bPrice - aPrice;
        // Best selling — use soldCount (not "sales" which doesn't exist)
        return (b.soldCount || 0) - (a.soldCount || 0);
      });
  }, [categoryProducts, filters, sortBy]);

  const gridProducts = categoryProducts.length ? filteredProducts : relatedProducts;

  // ── Filter handler ─────────────────────────────────────────────────────
  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      if (type === "price") return { ...prev, price: value };
      if (type === "includeOutOfStock") return { ...prev, includeOutOfStock: value };
      if (type === "dealsOnly") return { ...prev, dealsOnly: value };
      // Toggle array values
      const arr = prev[type] || [];
      return {
        ...prev,
        [type]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  // ── Page metadata ──────────────────────────────────────────────────────
  const getCategoryInfo = () => {
    if (effectivePet === "Dog") {
      return (
        dogCategories.find(
          (cat) =>
            cat.slug === slug ||
            cat.slug === normalizedSlug ||
            cat.slug === `dogs-${normalizedSlug}`
        ) || null
      );
    }
    if (effectivePet === "Cat") {
      return (
        catCategories.find(
          (cat) =>
            cat.slug === slug ||
            cat.slug === normalizedSlug ||
            cat.slug === `cats-${normalizedSlug}`
        ) || null
      );
    }
    return null;
  };

  const categoryInfo = getCategoryInfo();
  const pageTitle = categoryInfo?.name || normalizedSlug.replace(/-/g, " ");
  const pageHeading = isTopLevelPetCategory
    ? pageTitle
    : effectivePet
      ? `${effectivePet} ${pageTitle}`
      : pageTitle;
  const bannerKey = categoryBanners[slug]
    ? slug
    : effectivePet
      ? getCategoryBannerKey(effectivePet.toLowerCase() + "s", normalizedSlug)
      : slug;
  const banner = categoryBanners[bannerKey] || {
    title: pageHeading,
    subtitle: "",
    image: undefined,
  };
  const crumbs = [
    { label: "Home", path: "/" },
    {
      label:
        effectivePet === "Dog"
          ? "Dogs"
          : effectivePet === "Cat"
            ? "Cats"
            : effectivePet
              ? `${effectivePet}s`
              : "Pets",
      path: effectivePet === "Dog" ? "/dogs" : effectivePet === "Cat" ? "/cats" : "/pets",
    },
    { label: pageTitle },
  ];

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <Navbar />

      <CategoryHero
        title={banner.title || pageTitle}
        subtitle={banner.subtitle || ""}
        image={banner.image}
        breadcrumbs={crumbs}
      />

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* TOP SECTION */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold capitalize mt-20">{pageHeading}</h1>
            <p className="text-gray-500 mt-2">{gridProducts.length} Products Available</p>
            {!categoryProducts.length && relatedProducts.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Showing related products for this category.
              </p>
            )}
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

        {/* MAIN LAYOUT */}
        <div className="flex gap-8">
          {/* SIDEBAR */}
          <div className="w-65 shrink-0">
            <ShopSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={() => setFilters(DEFAULT_FILTERS)}
              products={sidebarProducts}
            />
          </div>
          {/* PRODUCT GRID */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {gridProducts.map((product) => (
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
  );
};

export default CategoryProducts;
