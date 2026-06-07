import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FilterSection from "./FilterSection";

/* ─── helpers ─── */
const getUnique = (arr, key) =>
  Array.from(new Set(arr.map((item) => item[key]).filter(Boolean))).sort();

const getCountMap = (values) =>
  values.reduce((acc, val) => {
    if (!val) return acc;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

const getWeightCounts = (products) => {
  const vals = products.flatMap((p) => (p.variants || []).map((v) => v.weight).filter(Boolean));
  return getCountMap(vals);
};

/* ─── checkbox row ─── */
const CheckRow = ({ label, count, checked, onChange }) => (
  <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer group hover:text-black">
    <span
      className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${
        checked
          ? "bg-orange-500 border-orange-500"
          : "border-gray-300 group-hover:border-orange-400"
      }`}
      onClick={onChange}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
          <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span className="flex-1 capitalize">{label}</span>
    {count !== undefined && (
      <span className="text-xs text-gray-400 ml-auto">({count})</span>
    )}
  </label>
);

/* ─── active filter pill ─── */
const ActivePill = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs px-2 py-1 rounded-full">
    {label}
    <button onClick={onRemove} className="hover:text-orange-900 ml-0.5">
      <X size={11} strokeWidth={2.5} />
    </button>
  </span>
);

/* ─── main component ─── */
const ShopSidebar = ({ filters, onFilterChange, onClearFilters, products }) => {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllWeights, setShowAllWeights] = useState(false);
  const [showAllFlavors, setShowAllFlavors] = useState(false);
  const [showAllSpecialDiets, setShowAllSpecialDiets] = useState(false);

  /* derive options from products */
  const brands           = useMemo(() => getUnique(products, "brand"), [products]);
  const petTypes         = useMemo(() => getUnique(products, "pet"), [products]);
  const productCategories= useMemo(() => getUnique(products, "productCategory"), [products]);
  const productTypes     = useMemo(() => getUnique(products, "subCategory"), [products]);
  const flavors          = useMemo(() => getUnique(products, "flavor"), [products]);
  const sizes            = useMemo(() => getUnique(products, "size"), [products]);
  const breedSizes       = useMemo(() => getUnique(products, "breedSize"), [products]);
  const lifeStages       = useMemo(() => getUnique(products, "lifeStage"), [products]);
  const vegTypes         = useMemo(() => getUnique(products, "vegType"), [products]);
  const specialDiets     = useMemo(() => getUnique(products, "specialDiet"), [products]);

  /* counts */
  const brandCounts        = useMemo(() => getCountMap(products.map((p) => p.brand)), [products]);
  const petTypeCounts      = useMemo(() => getCountMap(products.map((p) => p.pet)), [products]);
  const categoryCounts     = useMemo(() => getCountMap(products.map((p) => p.productCategory)), [products]);
  const productTypeCounts  = useMemo(() => getCountMap(products.map((p) => p.subCategory)), [products]);
  const flavorCounts       = useMemo(() => getCountMap(products.map((p) => p.flavor)), [products]);
  const sizeCounts         = useMemo(() => getCountMap(products.map((p) => p.size)), [products]);
  const vegCounts          = useMemo(() => getCountMap(products.map((p) => p.vegType)), [products]);
  const breedSizeCounts    = useMemo(() => getCountMap(products.map((p) => p.breedSize)), [products]);
  const lifeStageCounts    = useMemo(() => getCountMap(products.map((p) => p.lifeStage)), [products]);
  const specialDietCounts  = useMemo(() => getCountMap(products.map((p) => p.specialDiet)), [products]);
  const weightCounts       = useMemo(() => getWeightCounts(products), [products]);
  const weights            = useMemo(() => Object.keys(weightCounts).sort(), [weightCounts]);

  const allPrices = useMemo(
    () => products.flatMap((p) => (p.variants || []).map((v) => v.price).filter((x) => typeof x === "number")),
    [products]
  );
  const minPrice = allPrices.length ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length ? Math.max(...allPrices) : 99999;

  /* active filter count for badge */
  const activeCount = [
    filters.brands.length,
    filters.petTypes.length,
    filters.productCategories.length,
    filters.productTypes.length,
    filters.flavors.length,
    filters.weights.length,
    filters.lifeStages.length,
    filters.breedSizes.length,
    filters.sizes.length,
    filters.vegTypes.length,
    filters.specialDiets.length,
    filters.ratings.length,
    filters.includeOutOfStock ? 1 : 0,
    filters.dealsOnly ? 1 : 0,
    filters.price[1] < maxPrice ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  /* collect active pills */
  const activePills = [
    ...filters.brands.map((v) => ({ label: v, type: "brands", value: v })),
    ...filters.petTypes.map((v) => ({ label: v, type: "petTypes", value: v })),
    ...filters.productCategories.map((v) => ({ label: v, type: "productCategories", value: v })),
    ...filters.productTypes.map((v) => ({ label: v.replace(/-/g, " "), type: "productTypes", value: v })),
    ...filters.flavors.map((v) => ({ label: v, type: "flavors", value: v })),
    ...filters.weights.map((v) => ({ label: v, type: "weights", value: v })),
    ...filters.lifeStages.map((v) => ({ label: v, type: "lifeStages", value: v })),
    ...filters.breedSizes.map((v) => ({ label: v, type: "breedSizes", value: v })),
    ...filters.sizes.map((v) => ({ label: v, type: "sizes", value: v })),
    ...filters.vegTypes.map((v) => ({ label: v, type: "vegTypes", value: v })),
    ...filters.specialDiets.map((v) => ({ label: v, type: "specialDiets", value: v })),
    ...filters.ratings.map((v) => ({ label: `${v}★ & up`, type: "ratings", value: v })),
    ...(filters.dealsOnly ? [{ label: "Deals Only", type: "dealsOnly", value: true }] : []),
    ...(filters.includeOutOfStock ? [{ label: "Inc. Out of Stock", type: "includeOutOfStock", value: true }] : []),
  ];

  const SHOW_LIMIT = 5;

  return (
    <aside className="w-full shrink-0 sticky top-24 h-fit bg-white border border-gray-200 rounded-2xl overflow-y-auto max-h-[88vh] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-orange-500" />
          <h2 className="text-[17px] font-bold text-gray-900">Filter By</h2>
          {activeCount > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-orange-500 hover:text-orange-700 font-semibold transition-colors"
            type="button"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {activePills.length > 0 && (
        <div className="px-5 py-3 flex flex-wrap gap-1.5 border-b border-gray-100">
          {activePills.map((pill, i) => (
            <ActivePill
              key={i}
              label={pill.label}
              onRemove={() => {
                if (pill.type === "dealsOnly") onFilterChange("dealsOnly", false);
                else if (pill.type === "includeOutOfStock") onFilterChange("includeOutOfStock", false);
                else onFilterChange(pill.type, pill.value);
              }}
            />
          ))}
        </div>
      )}

      <div className="px-5 pb-5">
        {/* ── Availability ── */}
        <FilterSection title="Availability">
          <CheckRow
            label="Include Out Of Stock"
            checked={filters.includeOutOfStock}
            onChange={() => onFilterChange("includeOutOfStock", !filters.includeOutOfStock)}
          />
          <CheckRow
            label="Deals & Discounts Only"
            checked={filters.dealsOnly}
            onChange={() => onFilterChange("dealsOnly", !filters.dealsOnly)}
          />
        </FilterSection>

        {/* ── Price ── */}
        <FilterSection title="Price">
          {(() => {
            const rawMax = Array.isArray(filters.price) ? Number(filters.price[1]) : Number(filters.price || maxPrice);
            const currentMax = Math.min(rawMax, maxPrice);
            return (
              <>
                <div className="text-sm font-semibold text-gray-800 mb-1">
                  {`Up to $${currentMax.toLocaleString()}`}
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  step={1}
                  value={currentMax}
                  onChange={(e) => onFilterChange("price", [0, Number(e.target.value)])}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500 bg-orange-100"
                  style={{ accentColor: "#f97316" }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span>
                  <span>${maxPrice >= 99999 ? "99,999+" : maxPrice}</span>
                </div>
              </>
            );
          })()}
        </FilterSection>

        {/* ── Customer Rating ── */}
        <FilterSection title="Customer Rating">
          {[4, 3, 2, 1].map((star) => (
            <CheckRow
              key={star}
              label={
                <span className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < star ? "text-yellow-400" : "text-gray-200"}>★</span>
                  ))}
                  <span className="text-gray-500 ml-1">& up</span>
                </span>
              }
              checked={filters.ratings.includes(star)}
              onChange={() => onFilterChange("ratings", star)}
            />
          ))}
        </FilterSection>

        {/* ── Pet Type ── */}
        {petTypes.length > 0 && (
          <FilterSection title="Pet Type">
            {petTypes.map((type) => (
              <CheckRow
                key={type}
                label={type}
                count={petTypeCounts[type]}
                checked={filters.petTypes.includes(type)}
                onChange={() => onFilterChange("petTypes", type)}
              />
            ))}
          </FilterSection>
        )}

        {/* ── Product Categories ── */}
        {productCategories.length > 0 && (
          <FilterSection title="Product Categories">
            {productCategories.map((cat) => (
              <CheckRow
                key={cat}
                label={cat}
                count={categoryCounts[cat]}
                checked={filters.productCategories.includes(cat)}
                onChange={() => onFilterChange("productCategories", cat)}
              />
            ))}
          </FilterSection>
        )}

        {/* ── Brands ── */}
        {brands.length > 0 && (
          <FilterSection title="Brands">
            {(showAllBrands ? brands : brands.slice(0, SHOW_LIMIT)).map((brand) => (
              <CheckRow
                key={brand}
                label={brand}
                count={brandCounts[brand]}
                checked={filters.brands.includes(brand)}
                onChange={() => onFilterChange("brands", brand)}
              />
            ))}
            {brands.length > SHOW_LIMIT && (
              <button
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="text-xs text-orange-500 hover:text-orange-700 font-semibold text-left mt-1"
                type="button"
              >
                {showAllBrands ? "Show less ↑" : `+${brands.length - SHOW_LIMIT} more brands`}
              </button>
            )}
          </FilterSection>
        )}

        {/* ── Breed Size ── */}
        {breedSizes.length > 0 && (
          <FilterSection title="Breed Size">
            {breedSizes.map((size) => (
              <CheckRow
                key={size}
                label={size}
                count={breedSizeCounts[size]}
                checked={filters.breedSizes.includes(size)}
                onChange={() => onFilterChange("breedSizes", size)}
              />
            ))}
          </FilterSection>
        )}

        {/* ── Product Type ── */}
        {productTypes.length > 0 && (
          <FilterSection title="Product Type">
            {productTypes.map((type) => (
              <CheckRow
                key={type}
                label={type.replace(/-/g, " ")}
                count={productTypeCounts[type]}
                checked={filters.productTypes.includes(type)}
                onChange={() => onFilterChange("productTypes", type)}
              />
            ))}
          </FilterSection>
        )}

        {/* ── Pet Life Stage ── */}
        {lifeStages.length > 0 && (
          <FilterSection title="Pet Life Stage">
            {lifeStages.map((stage) => (
              <CheckRow
                key={stage}
                label={stage}
                count={lifeStageCounts[stage]}
                checked={filters.lifeStages.includes(stage)}
                onChange={() => onFilterChange("lifeStages", stage)}
              />
            ))}
          </FilterSection>
        )}

        {/* ── Weight ── */}
        {weights.length > 0 && (
          <FilterSection title="Weight / Pack Size">
            {(showAllWeights ? weights : weights.slice(0, SHOW_LIMIT)).map((w) => (
              <CheckRow
                key={w}
                label={w}
                count={weightCounts[w]}
                checked={filters.weights.includes(w)}
                onChange={() => onFilterChange("weights", w)}
              />
            ))}
            {weights.length > SHOW_LIMIT && (
              <button
                onClick={() => setShowAllWeights(!showAllWeights)}
                className="text-xs text-orange-500 hover:text-orange-700 font-semibold text-left mt-1"
                type="button"
              >
                {showAllWeights ? "Show less ↑" : `+${weights.length - SHOW_LIMIT} more sizes`}
              </button>
            )}
          </FilterSection>
        )}

        {/* ── Flavor ── */}
        {flavors.length > 0 && (
          <FilterSection title="Flavor">
            {(showAllFlavors ? flavors : flavors.slice(0, SHOW_LIMIT)).map((f) => (
              <CheckRow
                key={f}
                label={f}
                count={flavorCounts[f]}
                checked={filters.flavors.includes(f)}
                onChange={() => onFilterChange("flavors", f)}
              />
            ))}
            {flavors.length > SHOW_LIMIT && (
              <button
                onClick={() => setShowAllFlavors(!showAllFlavors)}
                className="text-xs text-orange-500 hover:text-orange-700 font-semibold text-left mt-1"
                type="button"
              >
                {showAllFlavors ? "Show less ↑" : `+${flavors.length - SHOW_LIMIT} more flavors`}
              </button>
            )}
          </FilterSection>
        )}

        {/* ── Special Diet ── */}
        {specialDiets.length > 0 && (
          <FilterSection title="Special Diet" defaultOpen={false}>
            {(showAllSpecialDiets ? specialDiets : specialDiets.slice(0, SHOW_LIMIT)).map((d) => (
              <CheckRow
                key={d}
                label={d}
                count={specialDietCounts[d]}
                checked={filters.specialDiets.includes(d)}
                onChange={() => onFilterChange("specialDiets", d)}
              />
            ))}
            {specialDiets.length > SHOW_LIMIT && (
              <button
                onClick={() => setShowAllSpecialDiets(!showAllSpecialDiets)}
                className="text-xs text-orange-500 hover:text-orange-700 font-semibold text-left mt-1"
                type="button"
              >
                {showAllSpecialDiets ? "Show less ↑" : `+${specialDiets.length - SHOW_LIMIT} more diets`}
              </button>
            )}
          </FilterSection>
        )}

        {/* ── Veg / Non-Veg ── */}
        {vegTypes.length > 0 && (
          <FilterSection title="Veg / Non-Veg">
            {vegTypes.map((v) => (
              <CheckRow
                key={v}
                label={v}
                count={vegCounts[v]}
                checked={filters.vegTypes.includes(v)}
                onChange={() => onFilterChange("vegTypes", v)}
              />
            ))}
          </FilterSection>
        )}

        {/* ── Size ── */}
        {sizes.length > 0 && (
          <FilterSection title="Size" defaultOpen={false}>
            {sizes.map((s) => (
              <CheckRow
                key={s}
                label={s}
                count={sizeCounts[s]}
                checked={filters.sizes.includes(s)}
                onChange={() => onFilterChange("sizes", s)}
              />
            ))}
          </FilterSection>
        )}
      </div>
    </aside>
  );
};

export default ShopSidebar;
