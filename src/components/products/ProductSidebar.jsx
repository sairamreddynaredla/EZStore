import { useState, useEffect } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

const filtersData = [
  {
    title: "Availability",
    type: "checkbox",
    options: ["Include Out Of Stock"],
  },

  {
    title: "Price",
    type: "price",
  },

  {
    title: "Pet Type",
    type: "checkbox",
    options: ["Dog", "Cat"],
  },

  {
    title: "Product Categories",
    type: "checkbox",
    options: ["Dog Food"],
  },

  {
    title: "Brands",
    type: "checkbox",
    options: [
      "Royal Canin",
      "Pedigree",
      "Acana",
      "Farmina",
      "Drools",
    ],
  },

  {
    title: "Breed Size",
    type: "checkbox",
    options: [
      "Extra Small",
      "Small",
      "Medium",
      "Large",
      "Giant",
    ],
  },

  {
    title: "Product Type",
    type: "checkbox",
    options: ["Dog Dry Food"],
  },

  {
    title: "Shop By Breed",
    type: "checkbox",
    options: [
      "Large",
      "Small",
      "Medium",
      "Extra Small",
    ],
  },

  {
    title: "Flavor",
    type: "checkbox",
    options: [
      "Chicken",
      "Fish",
      "Lamb",
      "Duck",
      "Salmon",
    ],
  },

  {
    title: "Weight",
    type: "checkbox",
    options: [
      "1lb",
      "5lb",
      "10lb",
      "15lb",
    ],
  },

  {
    title: "Pet Life Stages",
    type: "checkbox",
    options: [
      "Adult",
      "Puppy",
      "Senior",
      "All Life Stages",
    ],
  },

  {
    title: "Special Diet",
    type: "checkbox",
    options: [
      "High Protein",
      "Grain Free",
      "Low Grain",
    ],
  },

  {
    title: "Veg/Non-Veg",
    type: "checkbox",
    options: ["Veg", "Non-Veg"],
  },
];

const ProductSidebar = ({
  filters,
  setFilters,
}) => {
  const [openSections, setOpenSections] =
    useState({
      Availability: true,
      Price: true,
      "Pet Type": true,
      Brands: true,
    });

  // Local copy of filters so changes are applied when user clicks Apply
  const [localFilters, setLocalFilters] = useState(filters || {});

  const [localPrice, setLocalPrice] = useState(() => {
    const p = filters?.Price;
    return typeof p === 'number' ? p : 500;
  });

  useEffect(() => {
    setLocalFilters(filters || {});
    setLocalPrice(typeof filters?.Price === 'number' ? filters.Price : 500);
  }, [filters]);

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

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

  const hasChanges =
    JSON.stringify(localFilters || {}) !==
    JSON.stringify(filters || {});

  return (
    <aside
      className="
        w-[19.375rem]
        min-w-[19.375rem]
        sticky
        top-24
        h-[calc(100vh-110px)]
        overflow-y-auto
        bg-white
        border
        border-gray-200
        rounded-[1.5rem]
        p-6
        hidden
        lg:block
      "
    >
      {/* HEADER */}

      <div className="flex items-center gap-3 mb-8">

        <SlidersHorizontal size={28} />

        <h2 className="text-4xl font-bold">
          Filter By
        </h2>

        <button
          onClick={() => {
            setLocalFilters({});
            setLocalPrice(500);
            setFilters({});
          }}
          className="ml-auto text-sm text-gray-600 hover:underline"
        >
          Clear Filters
        </button>

      </div>

      {/* FILTERS */}

      {filtersData.map((filter) => (
        <div
          key={filter.title}
          className="
            border-b
            border-gray-200
            pb-6
            mb-6
          "
        >
          {/* SECTION HEADER */}

          <button
            onClick={() =>
              toggleSection(filter.title)
            }
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
              {filter.title}
            </h4>

            <ChevronDown
              size={20}
              className={`
                transition-transform
                duration-300
                ${
                  openSections[
                    filter.title
                  ]
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          {/* OPTIONS */}

          {openSections[filter.title] && (
            <div className="mt-5">

              {filter.type === "price" ? (
                <div>

                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={localPrice}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setLocalPrice(v);
                      setLocalFilters((prev) => ({ ...prev, Price: v }));
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
                    className="
                      w-full
                      h-14
                      bg-[#ffcc00]
                      hover:bg-yellow-400
                      rounded-full
                      font-semibold
                      mt-6
                      transition
                    "
                    onClick={applyFilters}
                    disabled={!hasChanges}
                    className={
                      `w-full h-14 rounded-full font-semibold mt-6 transition ` +
                      (hasChanges
                        ? "bg-[#ffcc00] hover:bg-yellow-400"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed")
                    }
                  >
                    {hasChanges ? "Apply Filters" : "No Changes"}
                  </button>

                </div>
              ) : (
                <div className="space-y-4">

                  {filter.options.map(
                    (option) => (
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
                            checked={
                              localFilters[
                                filter.title
                              ]?.includes(
                                option
                              ) || false
                            }
                            onChange={() =>
                              handleCheckbox(
                                filter.title,
                                option
                              )
                            }
                            className="
                              w-4
                              h-4
                              rounded
                              border-gray-300
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
                          (12)
                        </span>
                      </label>
                    )
                  )}

                </div>
              )}

            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default ProductSidebar;