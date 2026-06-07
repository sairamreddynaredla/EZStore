import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { dogCategories } from "../../data/dogCategories";
import { catCategories } from "../../data/catCategories";
import { categoryBanners } from "../../data/categoryBanners";
import { getCategoryBannerKey } from "../../utils/categoryBannerKey";
import { products } from "../../data/products";
import CategoryHero from "./CategoryHero";
import Breadcrumbs from "./Breadcrumbs";
import ProductFilterSidebar from "../filters/ProductFilterSidebar";
import ProductGrid from "../products/ProductGrid";

const getCategoryData = (petType, slug) => {
  const categories = petType === "dogs" ? dogCategories : catCategories;
  return categories.find((cat) => cat.slug === slug) || null;
};

const CategoryLayout = ({ petType: propPetType }) => {
  const params = useParams();
  const petType = propPetType || params.petType;
  const categorySlug = params.categorySlug || params["*"];
  const category = getCategoryData(petType, categorySlug);
  // Generate banner key and get banner
  const bannerKey = getCategoryBannerKey(petType, categorySlug);
  const banner = categoryBanners[bannerKey];

  // Base category products for this petType and categorySlug
  const categoryProducts = useMemo(() => {
    const effectiveSubCategory = categorySlug?.replace(/^(dogs|cats)-/, "");
    return products.filter(
      (p) =>
        String(p.pet ?? '').toLowerCase() === String(petType.slice(0, -1) ?? '').toLowerCase() &&
        p.subCategory === effectiveSubCategory
    );
  }, [petType, categorySlug]);

  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    breedSize: [],
    productType: [],
    lifeStages: [],
    specialDiets: [],
    vegTypes: [],
    price: [0, 99999],
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filterOptions = useMemo(() => {
    const brandCounts = new Map();
    const breedSizeCounts = new Map();
    const productTypeCounts = new Map();
    const lifeStageCounts = new Map();
    const specialDietCounts = new Map();
    const vegTypeCounts = new Map();
    const prices = [];

    categoryProducts.forEach((product) => {
      brandCounts.set(product.brand, (brandCounts.get(product.brand) || 0) + 1);
      breedSizeCounts.set(product.breedSize, (breedSizeCounts.get(product.breedSize) || 0) + 1);
      productTypeCounts.set(product.productType, (productTypeCounts.get(product.productType) || 0) + 1);
      lifeStageCounts.set(product.lifeStage, (lifeStageCounts.get(product.lifeStage) || 0) + 1);
      specialDietCounts.set(product.specialDiet, (specialDietCounts.get(product.specialDiet) || 0) + 1);
      vegTypeCounts.set(product.vegType, (vegTypeCounts.get(product.vegType) || 0) + 1);
      // Collect all variant prices (not just first variant) so the range reflects full distribution
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        product.variants.forEach((v) => {
          if (typeof v.price === "number" && v.price > 0) prices.push(v.price);
        });
      } else {
        const p = product.price || 0;
        if (p > 0) prices.push(p);
      }
    });

    const getOptionList = (map) =>
      Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 99999;

    return {
      brands: getOptionList(brandCounts),
      breedSize: getOptionList(breedSizeCounts),
      productType: getOptionList(productTypeCounts),
      lifeStages: getOptionList(lifeStageCounts),
      specialDiets: getOptionList(specialDietCounts),
      vegTypes: getOptionList(vegTypeCounts),
      price: { min: minPrice, max: maxPrice },
    };
  }, [categoryProducts]);

  const visibleProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      // For price filtering, consider the lowest variant price for the product (so it's included if any variant matches)
      let price = product.price || 0;
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        const variantPrices = product.variants.map((v) => Number(v.price || 0)).filter((n) => n > 0);
        if (variantPrices.length) price = Math.min(...variantPrices);
      }

      if (selectedFilters.brands.length && !selectedFilters.brands.includes(product.brand)) {
        return false;
      }
      if (selectedFilters.breedSize.length && !selectedFilters.breedSize.includes(product.breedSize)) {
        return false;
      }
      if (selectedFilters.productType.length && !selectedFilters.productType.includes(product.productType)) {
        return false;
      }
      if (selectedFilters.lifeStages.length && !selectedFilters.lifeStages.includes(product.lifeStage)) {
        return false;
      }
      if (selectedFilters.specialDiets.length && !selectedFilters.specialDiets.includes(product.specialDiet)) {
        return false;
      }
      if (selectedFilters.vegTypes.length && !selectedFilters.vegTypes.includes(product.vegType)) {
        return false;
      }
      if (price < Number(selectedFilters.price[0]) || price > Number(selectedFilters.price[1])) {
        return false;
      }
      return true;
    });
  }, [categoryProducts, selectedFilters]);

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => {
      if (type === "price") {
        return {
          ...prev,
          price: value,
        };
      }
      const current = prev[type] || [];
      return {
        ...prev,
        [type]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  if (!category) {
    return <div className="p-8 text-center text-gray-500">Category not found.</div>;
  }

  // Breadcrumbs structure
  const crumbs = [
    { label: "Home", path: "/" },
    { label: petType.charAt(0).toUpperCase() + petType.slice(1), path: `/${petType}` },
    { label: category.name, path: category.path },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <CategoryHero
        title={banner?.title || category.name}
        subtitle={banner?.subtitle}
        highlights={banner?.highlights}
        backgroundColor={banner?.backgroundColor}
        image={banner?.image}
        breadcrumbs={banner?.breadcrumbs}
      />
      <Breadcrumbs crumbs={crumbs} />
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 shrink-0">
          <ProductFilterSidebar
            filters={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
        </aside>
        <section className="flex-1">
          <ProductGrid products={visibleProducts} loading={false} />
        </section>
      </div>
    </main>
  );
};

export default CategoryLayout;
