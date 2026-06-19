import { useState, useEffect } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { products } from "../../data/products";

const ProductFilters = ({ filters = {}, setFilters = () => {} }) => {
  const [openSections, setOpenSections] = useState({
    Availability: true,
    Price: true,
    "Pet Type": true,
    Brands: true,
  });

  // Local copy of filters so changes are applied only when user clicks Apply
  const [localFilters, setLocalFilters] = useState(filters || {});
  const [localPrice, setLocalPrice] = useState(() => {
    // use numeric price if provided, otherwise default to 500
    const p = filters?.Price;
    return typeof p === "number" ? p : 500;
  });

  useEffect(() => {
    setLocalFilters(filters || {});
    setLocalPrice(typeof filters?.Price === "number" ? filters.Price : 500);
  }, [filters]);

  // DYNAMIC FILTER VALUES

  const brands = [...new Set(products.map((p) => p.brand))];

  const flavors = [...new Set(products.map((p) => p.flavor))];

  const lifeStages = [...new Set(products.map((p) => p.lifeStage))];

  const breedSizes = [...new Set(products.map((p) => p.breedSize))];

  const categories = [...new Set(products.map((p) => p.category))];

  const weights = [...new Set(products.flatMap((p) => p.weight || []))];

  const filterSections = [
    {
      title: "Availability",
      options: ["Include Out Of Stock"],
    },

    {
      title: "Pet Type",
      options: ["Dog", "Cat"],
    },

    {
      title: "Product Categories",
      options: categories,
    },

    {
      title: "Brands",
      options: brands,
    },

    {
      title: "Breed Size",
      options: breedSizes,
    },

    {
      title: "Flavor",
      options: flavors,
    },

    {
      title: "Pet Life Stages",
      options: lifeStages,
    },

    {
      title: "Weight",
      options: weights,
    },
  ];

  // TOGGLE SECTION

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // HANDLE FILTERS

  const handleCheckbox = (section, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [section]: prev[section]?.includes(value)
        ? prev[section].filter((item) => item !== value)
        : [...(prev[section] || []), value],
    }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
  };

  const hasChanges = JSON.stringify(localFilters || {}) !== JSON.stringify(filters || {});

  return (
    <aside
      className="
        hidden lg:block
        w-[19.375rem]
        min-w-[19.375rem]
        bg-white
        border
        border-gray-200
        rounded-[1.5rem]
        p-6
        sticky
        top-24
        h-[calc(100vh-120px)]
        overflow-y-auto
      "
    >
      {/* HEADER */}

      <div className="flex items-center gap-3 mb-8">
        <SlidersHorizontal size={28} className="text-black" />

        <h2 className="text-3xl font-bold text-black">Filter By</h2>

        <button
          onClick={() => {
            // clear all filters immediately
            setLocalFilters({});
            setLocalPrice(500);
            setFilters({});
          }}
          className="ml-auto text-sm text-gray-600 hover:underline"
        >
          Clear Filters
        </button>
      </div>

      {/* PRICE FILTER */}

      <div
        className="
          border-b
          border-gray-200
          pb-6
          mb-6
        "
      >
        <button
          onClick={() => toggleSection("Price")}
          className="
            w-full
            flex
            items-center
            justify-between
          "
        >
          <h4 className="text-xl font-bold">Price</h4>

          <ChevronDown
            size={20}
            className={`transition-transform ${openSections["Price"] ? "rotate-180" : ""}`}
          />
        </button>

        {openSections["Price"] && (
          <div className="mt-5">
            <input
              type="range"
              min="10"
              max="500"
              value={localPrice}
              onChange={(e) => {
                const v = Number(e.target.value);
                setLocalPrice(v);
                const updated = (prev) => ({ ...prev, Price: v });
                setLocalFilters(updated);
                // apply price live so results update as slider moves
                setFilters((prev) => ({ ...(prev || {}), Price: v }));
              }}
              className="
                        w-full
                        accent-black
                      "
            />

            <div className="mt-2 text-sm text-gray-700">Up to ${localPrice}</div>
            <div
              className="
                flex
                justify-between
                mt-4
                text-gray-500
              "
            >
              <span>$10</span>
              <span>$500</span>
            </div>

            <button
              onClick={applyFilters}
              disabled={!hasChanges}
              className={
                `w-full h-12 rounded-full font-semibold mt-5 transition ` +
                (hasChanges
                  ? "bg-[#ffcc00] hover:bg-yellow-400"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed")
              }
            >
              {hasChanges ? "Apply Filters" : "No Changes"}
            </button>
          </div>
        )}
      </div>

      {/* FILTER SECTIONS */}

      {filterSections.map((section) => (
        <div
          key={section.title}
          className="
            border-b
            border-gray-200
            pb-6
            mb-6
          "
        >
          {/* TITLE */}

          <button
            onClick={() => toggleSection(section.title)}
            className="
              w-full
              flex
              items-center
              justify-between
            "
          >
            <h4
              className="
                text-xl
                font-bold
                text-gray-900
              "
            >
              {section.title}
            </h4>

            <ChevronDown
              size={20}
              className={`
                transition-transform
                ${openSections[section.title] ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* OPTIONS */}

          {openSections[section.title] && (
            <div className="mt-5 space-y-4">
              {section.options.map((option) => (
                <label
                  key={option}
                  className="
                      flex
                      items-center
                      justify-between
                      cursor-pointer
                      group
                    "
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={localFilters[section.title]?.includes(option) || false}
                      onChange={() => handleCheckbox(section.title, option)}
                      className="
                          w-4
                          h-4
                          rounded
                          border-gray-300
                          accent-black
                        "
                    />

                    <span
                      className="
                          text-gray-700
                          group-hover:text-black
                          transition
                        "
                    >
                      {option}
                    </span>
                  </div>

                  <span
                    className="
                        text-xs
                        text-gray-400
                      "
                  >
                    (
                    {
                      products.filter((p) => {
                        if (section.title === "Brands") return p.brand === option;

                        if (section.title === "Flavor") return p.flavor === option;

                        if (section.title === "Breed Size") return p.breedSize === option;

                        if (section.title === "Pet Life Stages") return p.lifeStage === option;

                        if (section.title === "Product Categories") return p.category === option;

                        return true;
                      }).length
                    }
                    )
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default ProductFilters;
