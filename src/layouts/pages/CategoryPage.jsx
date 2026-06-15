import {
  useParams,
  Link,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { products } from "../../data/products";
import { categoryBanners } from "../../data/categoryBanners";
import useCart from "../../hooks/usecart";
import {
  resolveProductImage,
  resolveProductImageFallback,
} from "../../utils/productImage";


const CategoryPage = () => {

  const { category } = useParams();

  const {
    addToCart,
    cartItems = [],
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [filters, setFilters] =
    useState({
      petTypes: [],
      productCategories: [],
      productTypes: [],
      shopByBreeds: [],
      shopByConcerns: [],
      vegTypes: [],
      brands: [],
      flavors: [],
      weights: [],
      lifeStages: [],
      breedSizes: [],
      specialDiets: [],
      sizes: [],
                [
                  "Royal Canin",
                  "Pedigree",
                  "Drools",
                  "Farmina",
                  "Taste Of The Wild",
                  "Purina",
                ].map((brand) => (
    useState({
      availability: true,
      price: true,
      petTypes: true,
      productCategories: true,
      brands: true,
      breedSizes: true,
      productTypes: true,
      shopByBreeds: true,
      shopByConcerns: true,
      flavors: true,
      weights: true,
      lifeStages: true,
      specialDiets: true,
      vegTypes: true,
      sizes: true,
    });

  const [sortBy, setSortBy] =
    useState("");

  // TOGGLE FILTER SECTIONS

  const toggleSection = (
    section
  ) => {

    setOpenSections((prev) => ({
      ...prev,
      [section]:
        !prev[section],
    }));
  };

  // HANDLE FILTERS

  const handleFilterChange = (
    type,
    value
  ) => {

    setFilters((prev) => {

      const exists =
        prev[type].includes(value);

      return {
        ...prev,

        [type]: exists
          ? prev[type].filter(
              (item) =>
                item !== value
            )
          : [
              ...prev[type],
              value,
            ],
      };
    });
  };

  // CURRENT CATEGORY BANNER

  const banner =
    categoryBanners[category];

  // CATEGORY PRODUCTS

  const categoryProducts =
    products.filter(
      (product) =>
        product.category === category
    );

  const filterOptions = {
    petTypes: Array.from(
      new Set(categoryProducts.map(
        (product) => product.petType
      )).values()
    ).sort(),
    productCategories: Array.from(
      new Set(categoryProducts.map(
        (product) => product.productCategory
      )).values()
    ).sort(),
    productTypes: Array.from(
      new Set(categoryProducts.map(
        (product) => product.productType
      )).values()
    ).sort(),
    shopByBreeds: Array.from(
      new Set(categoryProducts.map(
        (product) => product.shopByBreed
      )).values()
    ).sort(),
    shopByConcerns: Array.from(
      new Set(categoryProducts.map(
        (product) => product.specialDiet
      )).values()
    ).sort(),
    breedSizes: Array.from(
      new Set(categoryProducts.map(
        (product) => product.breedSize
      )).values()
    ).sort(),
    vegTypes: Array.from(
      new Set(categoryProducts.map(
        (product) => product.vegType
      )).values()
    ).sort(),
    sizes: Array.from(
      new Set(categoryProducts.map(
        (product) => product.size
      )).values()
    ).sort(),
  };

  const priceRanges = [
    { value: "under-500", label: "Under $500" },
    { value: "500-1000", label: "$500 - $1000" },
    { value: "1000-2000", label: "$1000 - $2000" },
    { value: "2000-5000", label: "$2000 - $5000" },
    { value: "5000+", label: "Above $5000" },
  ];

  const getProductPrice = (product) =>
    product.variants?.[0]?.price || product.price || 0;

  // FILTER PRODUCTS

  let filteredProducts =
    categoryProducts.filter(
      (product) => {

        const price = getProductPrice(product);

        // AVAILABILITY

        if (
          !includeOutOfStock &&
          product.stock <= 0
        ) {
          return false;
        }

        // PRICE

        if (priceRange) {
          const [min, max] =
            priceRange === "under-500"
              ? [0, 499]
              : priceRange === "500-1000"
              ? [500, 1000]
              : priceRange === "1000-2000"
              ? [1000, 2000]
              : priceRange === "2000-5000"
              ? [2000, 5000]
              : [5001, Infinity];

          if (price < min || price > max) {
            return false;
          }
        }

        // PET TYPE

        if (
          filters.petTypes.length > 0 &&
          !filters.petTypes.includes(
            product.petType
          )
        ) {
          return false;
        }

        // PRODUCT CATEGORIES

        if (
          filters.productCategories.length > 0 &&
          !filters.productCategories.includes(
            product.productCategory
          )
        ) {
          return false;
        }

        // BRANDS

        if (
          filters.brands.length > 0 &&
          !filters.brands.includes(
            product.brand
          )
        ) {
          return false;
        }

        // BREED SIZE

        if (
          filters.breedSizes.length > 0 &&
          !filters.breedSizes.includes(
            product.breedSize
          )
        ) {
          return false;
        }

        // PRODUCT TYPE

        if (
          filters.productTypes.length > 0 &&
          !filters.productTypes.includes(
            product.productType
          )
        ) {
          return false;
        }

        // SHOP BY BREED

        if (
          filters.shopByBreeds.length > 0 &&
          !filters.shopByBreeds.includes(
            product.shopByBreed
          )
        ) {
          return false;
        }

        // SHOP BY CONCERN

        if (
          filters.shopByConcerns.length > 0 &&
          !filters.shopByConcerns.includes(
            product.specialDiet
          )
        ) {
          return false;
        }

        // FLAVORS

        if (
          filters.flavors.length > 0 &&
          !filters.flavors.includes(
            product.flavor
          )
        ) {
          return false;
        }

        // WEIGHTS

        if (
          filters.weights.length > 0 &&
          !filters.weights.includes(
            product.weight
          )
        ) {
          return false;
        }

        // SIZES

        if (
          filters.sizes.length > 0 &&
          !filters.sizes.includes(
            product.size
          )
        ) {
          return false;
        }

        // PET LIFE STAGES

        if (
          filters.lifeStages.length >
            0 &&
          !filters.lifeStages.includes(
            product.lifeStage
          )
        ) {
          return false;
        }

        // SPECIAL DIETS

        if (
          filters.specialDiets.length >
            0 &&
          !filters.specialDiets.includes(
            product.specialDiet
          )
        ) {
          return false;
        }

        // VEG/NON-VEG

        if (
          filters.vegTypes.length > 0 &&
          !filters.vegTypes.includes(
            product.vegType
          )
        ) {
          return false;
        }

        return true;
      }
    );

  // SORTING

  if (sortBy === "low") {

    filteredProducts.sort(
      (a, b) =>
        a.price - b.price
    );

  }

  if (sortBy === "high") {

    filteredProducts.sort(
      (a, b) =>
        b.price - a.price
    );

  }

  return (

    <div className="w-full bg-[#f5f5f5] px-4 lg:px-6 py-6 min-h-screen">

      {/* BANNER */}

      {banner && (

        <div className="w-full overflow-hidden rounded-3xl">
          <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] overflow-hidden rounded-3xl">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

      )}

      {/* MAIN CONTENT */}

      <div className="flex flex-col lg:flex-row gap-6 mt-8">

        {/* SIDEBAR */}

        <div className="w-full lg:w-[320px] bg-white border border-gray-200 rounded-3xl p-5 h-fit sticky top-27.5 max-h-[88vh] overflow-y-auto">

          {/* HEADER */}

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">

              Filter By

            </h2>

            <button
              onClick={() => {
                setFilters({
                  petTypes: [],
                  productCategories: [],
                  productTypes: [],
                  shopByBreeds: [],
                  shopByConcerns: [],
                  vegTypes: [],
                  brands: [],
                  flavors: [],
                  weights: [],
                  lifeStages: [],
                  breedSizes: [],
                  specialDiets: [],
                  sizes: [],
                });
                setIncludeOutOfStock(false);
                setPriceRange("");
              }}
              className="text-sm text-orange-500 font-semibold"
            >
              Clear
            </button>

          </div>

          {/* AVAILABILITY */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection(
                  "availability"
                )
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Availability

              </h3>

              {openSections.availability ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.availability && (

              <div className="mt-4">

                <label className="flex items-center gap-3 text-sm cursor-pointer">

                  <input
                    type="checkbox"
                    checked={includeOutOfStock}
                    onChange={() =>
                      setIncludeOutOfStock(
                        (prev) => !prev
                      )
                    }
                    className="accent-orange-500"
                  />

                  Include Out Of Stock

                </label>

              </div>

            )}

          </div>

          {/* PRICE */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection("price")
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Price

              </h3>

              {openSections.price ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.price && (

              <div className="mt-4 space-y-3">
                {priceRanges.map((range) => (
                  <label
                    key={range.value}
                    className="flex items-center gap-3 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === range.value}
                      onChange={() =>
                        setPriceRange(range.value)
                      }
                      className="accent-orange-500"
                    />
                    {range.label}
                  </label>
                ))}
              </div>

            )}

          </div>

          {/* PET TYPE */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection("petTypes")
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Pet Type

              </h3>

              {openSections.petTypes ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.petTypes && (

              <div className="mt-4 space-y-3">
                {filterOptions.petTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.petTypes.includes(type)}
                      onChange={() =>
                        handleFilterChange(
                          "petTypes",
                          type
                        )
                      }
                      className="accent-orange-500"
                    />
                    {type}
                  </label>
                ))}
              </div>

            )}

          </div>

          {/* PRODUCT CATEGORIES */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection("productCategories")
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Product Categories

              </h3>

              {openSections.productCategories ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.productCategories && (

              <div className="mt-4 space-y-3">
                {filterOptions.productCategories.map((categoryOption) => (
                  <label
                    key={categoryOption}
                    className="flex items-center justify-between cursor-pointer text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.productCategories.includes(
                          categoryOption
                        )}
                        onChange={() =>
                          handleFilterChange(
                            "productCategories",
                            categoryOption
                          )
                        }
                        className="accent-orange-500"
                      />
                      <span>{categoryOption}</span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      ({
                        categoryProducts.filter(
                          (product) =>
                            product.productCategory ===
                            categoryOption
                        ).length
                      })
                    </span>
                  </label>
                ))}
              </div>

            )}

          </div>

          {/* BRANDS */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection(
                  "brands"
                )
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Brands

              </h3>

              {openSections.brands ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.brands && (

              <div className="mt-4 space-y-3 max-h-62.5 overflow-y-auto pr-2">

                {[
                  "Royal Canin",
                  "Pedigree",
                  "Drools",
                  "Farmina",
                  "Taste Of The Wild",
                  "SmartHeart",
                  "Purina",
                ].map((brand) => (

                  <label
                    key={brand}
                    className="flex items-center justify-between cursor-pointer text-sm"
                  >

                    <div className="flex items-center gap-3">

                      <input
                        type="checkbox"
                        checked={filters.brands.includes(
                          brand
                        )}
                        onChange={() =>
                          handleFilterChange(
                            "brands",
                            brand
                          )
                        }
                        className="accent-orange-500"
                      />

                      <span>
                        {brand}
                      </span>

                    </div>

                    <span className="text-gray-400 text-xs">

                      (
                      {
                        categoryProducts.filter(
                          (p) =>
                            p.brand ===
                            brand
                        ).length
                      }
                      )

                    </span>

                  </label>

                ))}

              </div>

            )}

          </div>

          {/* BREED SIZE */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection(
                  "breedSizes"
                )
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Breed Size

              </h3>

              {openSections.breedSizes ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.breedSizes && (

              <div className="mt-4 space-y-3">

                {filterOptions.breedSizes.map((breedFilter) => (

                  <label
                    key={breedFilter}
                    className="flex items-center justify-between cursor-pointer text-sm"
                  >

                    <div className="flex items-center gap-3">

                      <input
                        type="checkbox"
                        checked={filters.breedSizes.includes(
                          breedFilter
                        )}
                        onChange={() =>
                          handleFilterChange(
                            "breedSizes",
                            breedFilter
                          )
                        }
                        className="accent-orange-500"
                      />

                      <span>
                        {breedFilter}
                      </span>

                    </div>

                  </label>

                ))}

              </div>

            )}

          </div>

          {/* PRODUCT TYPE */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection("productTypes")
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Product Type

              </h3>

              {openSections.productTypes ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.productTypes && (

              <div className="mt-4 space-y-3">
                {filterOptions.productTypes.map((productType) => (
                  <label
                    key={productType}
                    className="flex items-center justify-between cursor-pointer text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.productTypes.includes(
                          productType
                        )}
                        onChange={() =>
                          handleFilterChange(
                            "productTypes",
                            productType
                          )
                        }
                        className="accent-orange-500"
                      />
                      <span>{productType}</span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      ({
                        categoryProducts.filter(
                          (product) =>
                            product.productType ===
                            productType
                        ).length
                      })
                    </span>
                  </label>
                ))}
              </div>

            )}

          </div>

          {/* SHOP BY BREED */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection("shopByBreeds")
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Shop By Breed

              </h3>

              {openSections.shopByBreeds ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.shopByBreeds && (

              <div className="mt-4 space-y-3">
                {filterOptions.shopByBreeds.map((breed) => (
                  <label
                    key={breed}
                    className="flex items-center justify-between cursor-pointer text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.shopByBreeds.includes(
                          breed
                        )}
                        onChange={() =>
                          handleFilterChange(
                            "shopByBreeds",
                            breed
                          )
                        }
                        className="accent-orange-500"
                      />
                      <span>{breed}</span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      ({
                        categoryProducts.filter(
                          (product) =>
                            product.shopByBreed ===
                            breed
                        ).length
                      })
                    </span>
                  </label>
                ))}
              </div>

            )}

          </div>

          {/* SHOP BY CONCERN */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection("shopByConcerns")
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Shop By Concern

              </h3>

              {openSections.shopByConcerns ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.shopByConcerns && (

              <div className="mt-4 space-y-3">
                {filterOptions.shopByConcerns.map((concern) => (
                  <label
                    key={concern}
                    className="flex items-center justify-between cursor-pointer text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.shopByConcerns.includes(
                          concern
                        )}
                        onChange={() =>
                          handleFilterChange(
                            "shopByConcerns",
                            concern
                          )
                        }
                        className="accent-orange-500"
                      />
                      <span>{concern}</span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      ({
                        categoryProducts.filter(
                          (product) =>
                            product.specialDiet ===
                            concern
                        ).length
                      })
                    </span>
                  </label>
                ))}
              </div>

            )}

          </div>

          {/* VEG/NON-VEG */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection("vegTypes")
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Veg/Non-Veg

              </h3>

              {openSections.vegTypes ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.vegTypes && (

              <div className="mt-4 space-y-3">
                {filterOptions.vegTypes.map((vegType) => (
                  <label
                    key={vegType}
                    className="flex items-center gap-3 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.vegTypes.includes(
                        vegType
                      )}
                      onChange={() =>
                        handleFilterChange(
                          "vegTypes",
                          vegType
                        )
                      }
                      className="accent-orange-500"
                    />
                    {vegType}
                  </label>
                ))}
              </div>

            )}

          </div>

          {/* SIZES */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection("sizes")
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Sizes

              </h3>

              {openSections.sizes ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.sizes && (

              <div className="mt-4 space-y-3">
                {filterOptions.sizes.map((sizeOption) => (
                  <label
                    key={sizeOption}
                    className="flex items-center gap-3 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(
                        sizeOption
                      )}
                      onChange={() =>
                        handleFilterChange(
                          "sizes",
                          sizeOption
                        )
                      }
                      className="accent-orange-500"
                    />
                    {sizeOption}
                  </label>
                ))}
              </div>

            )}

          </div>

          {/* FLAVORS */}

<div className="border-b border-gray-200 py-4">

  <button
    onClick={() =>
      toggleSection(
        "flavors"
      )
    }
    className="w-full flex items-center justify-between"
  >

    <h3 className="font-semibold text-[15px]">

      Flavor

    </h3>

    {openSections.flavors ? (
      <ChevronUp size={18} />
    ) : (
      <ChevronDown size={18} />
    )}

  </button>

  {openSections.flavors && (

    <div className="mt-4 space-y-3 max-h-62.5 overflow-y-auto pr-2">

      {[
        "Chicken",
        "Chicken & Milk",
        "Egg & Chicken",
        "Pumpkin & Lamb",
        "Smoked Salmon",
        "Beef",
        "Chicken & Rice",
      ].map((flavor) => {

        // PRODUCT COUNT

        const flavorCount =
          categoryProducts.filter(
            (product) => {

              if (
                Array.isArray(
                  product.flavor
                )
              ) {

                return product.flavor.includes(
                  flavor
                );
              }

              return (
                product.flavor ===
                flavor
              );
            }
          ).length;

        return (

          <label
            key={flavor}
            className="flex items-center justify-between cursor-pointer text-sm group"
          >

            {/* LEFT */}

            <div className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={filters.flavors.includes(
                  flavor
                )}
                onChange={() =>
                  handleFilterChange(
                    "flavors",
                    flavor
                  )
                }
                className="accent-orange-500 w-4 h-4 cursor-pointer"
              />

              <span className="group-hover:text-orange-500 transition">

                {flavor}

              </span>

            </div>

            {/* COUNT */}

            <span className="text-gray-400 text-xs">

              ({flavorCount})

            </span>

          </label>

        );

      })}

    </div>

  )}

</div>

          {/* WEIGHTS */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection(
                  "weights"
                )
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Weight

              </h3>

              {openSections.weights ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.weights && (

              <div className="mt-4 space-y-3 max-h-62.5 overflow-y-auto pr-2">

                {[
                  "1kg",
                  "2kg",
                  "3kg",
                  "5kg",
                  "10kg",
                  "15kg",
                  "20kg",
                ].map((weight) => (

                  <label
                    key={weight}
                    className="flex items-center justify-between cursor-pointer text-sm"
                  >

                    <div className="flex items-center gap-3">

                      <input
                        type="checkbox"
                        checked={filters.weights.includes(
                          weight
                        )}
                        onChange={() =>
                          handleFilterChange(
                            "weights",
                            weight
                          )
                        }
                        className="accent-orange-500"
                      />

                      <span>
                        {weight}
                      </span>

                    </div>

                  </label>

                ))}

              </div>

            )}

          </div>

          {/* LIFE STAGE */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection(
                  "lifeStages"
                )
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Pet Life Stages

              </h3>

              {openSections.lifeStages ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.lifeStages && (

              <div className="mt-4 space-y-3">

                {[
                  "Puppy",
                  "Adult",
                  "Senior",
                ].map((stage) => (

                  <label
                    key={stage}
                    className="flex items-center gap-3 text-sm cursor-pointer"
                  >

                    <input
                      type="checkbox"
                      checked={filters.lifeStages.includes(
                        stage
                      )}
                      onChange={() =>
                        handleFilterChange(
                          "lifeStages",
                          stage
                        )
                      }
                      className="accent-orange-500"
                    />

                    {stage}

                  </label>

                ))}

              </div>

            )}

          </div>

          {/* SPECIAL DIET */}

          <div className="border-b border-gray-200 py-4">

            <button
              onClick={() =>
                toggleSection(
                  "specialDiets"
                )
              }
              className="w-full flex items-center justify-between"
            >

              <h3 className="font-semibold text-[15px]">

                Special Diet

              </h3>

              {openSections.specialDiets ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}

            </button>

            {openSections.specialDiets && (

              <div className="mt-4 space-y-3">

                {[
                  "High Protein",
                  "Grain Free",
                  "Low Grain",
                ].map((diet) => (

                  <label
                    key={diet}
                    className="flex items-center gap-3 text-sm cursor-pointer"
                  >

                    <input
                      type="checkbox"
                      checked={filters.specialDiets.includes(
                        diet
                      )}
                      onChange={() =>
                        handleFilterChange(
                          "specialDiets",
                          diet
                        )
                      }
                      className="accent-orange-500"
                    />

                    {diet}

                  </label>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* PRODUCTS SECTION */}

        <div className="flex-1">

          {/* TOP BAR */}

          <div className="bg-white border border-gray-200 rounded-3xl px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

            <h2 className="text-2xl font-bold text-gray-900">

              {filteredProducts.length} Products

            </h2>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white"
            >

              <option value="">
                Sort By
              </option>

              <option value="low">
                Price Low to High
              </option>

              <option value="high">
                Price High to Low
              </option>

            </select>

          </div>

          {/* PRODUCT GRID */}

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredProducts.map(
              (product) => {

                const cartItem =
                  cartItems.find(
                    (item) =>
                      item.id ===
                      product.id
                  );

                return (

                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-[28px] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >

                    {/* IMAGE */}

                    <Link
                      to={`/product/${product.id}`}
                    >

                      <div className="bg-gray-50 p-5 relative">

                        <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">

                          20% OFF

                        </div>

                        <img
                          src={resolveProductImage(product)}
                          alt={product.name}
                          className="w-full h-55 object-contain hover:scale-105 transition duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            const fallback = resolveProductImageFallback(product)
                            if (e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback
                            }
                          }}
                        />

                      </div>

                    </Link>

                    {/* INFO */}

                    <div className="p-5">

                      <p className="text-sm text-gray-500 mb-2">

                        {product.brand}

                      </p>

                      <Link
                        to={`/product/${product.id}`}
                      >

                        <h3 className="font-semibold text-sm leading-6 line-clamp-2 min-h-12 hover:text-orange-500 transition">

                          {product.name}

                        </h3>

                      </Link>

                      <div className="flex items-center gap-2 mt-4">

                        <p className="text-orange-500 text-2xl font-bold">

                        ${product.variants?.[0]?.price}

                        </p>

                        {product.variants?.[0]?.originalPrice && (

                          <span className="text-gray-400 line-through text-sm">

                            ${
                              product.oldPrice
                            }

                          </span>

                        )}

                      </div>

                      {/* CART */}

                      {!cartItem ? (

                        <button
                          onClick={() =>
                            addToCart(
                              product
                            )
                          }
                          className="w-full mt-5 py-3 rounded-2xl font-semibold transition bg-amber-400 hover:bg-amber-300 text-black"
                        >

                          Add To Cart

                        </button>

                      ) : (

                        <div className="w-full mt-5 flex items-center justify-between border border-orange-500 rounded-2xl overflow-hidden">

                          <button
                            onClick={() =>
                              decreaseQuantity(
                                product.id
                              )
                            }
                            className="w-14 h-12 text-xl font-bold hover:bg-orange-50 transition"
                          >

                            -

                          </button>

                          <span className="font-semibold text-lg">

                            {
                              cartItem.quantity
                            }

                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                product.id
                              )
                            }
                            className="w-14 h-12 text-xl font-bold hover:bg-orange-50 transition"
                          >

                            +

                          </button>

                        </div>

                      )}

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>

      </div>

    </div>

  );
};

export default CategoryPage;