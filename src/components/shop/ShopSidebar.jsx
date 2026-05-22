
import FilterSection from "./FilterSection";


const getUnique = (arr, key) => Array.from(new Set(arr.map(item => item[key]).filter(Boolean)));

const ShopSidebar = ({ filters, onFilterChange, onClearFilters, products }) => {
  // Dynamic options
  const brands = getUnique(products, 'brand');
  const petTypes = getUnique(products, 'pet');
  const flavors = getUnique(products, 'flavor');
  const weights = Array.from(new Set(products.flatMap(p => (p.variants || []).map(v => v.weight))));
  const lifeStages = getUnique(products, 'lifeStage');
  const foodForms = getUnique(products, 'subCategory');
  const specialDiets = [
    ...new Set(products.flatMap(p => {
      if (p.subCategory && p.subCategory.toLowerCase().includes('grain')) return ['Grain Free'];
      if (p.subCategory && p.subCategory.toLowerCase().includes('prescription')) return ['Prescription'];
      return [];
    }))
  ];
  // Price range
  const allPrices = products.flatMap(p => (p.variants || []).map(v => v.price));
  const minPrice = Math.min(...allPrices, 0);
  const maxPrice = Math.max(...allPrices, 99999);
  // Star ratings
  const starOptions = [5, 4, 3, 2, 1];
      {/* CUSTOMER REVIEW (STAR RATING) */}
      <FilterSection title="Customer Review">
        {starOptions.map(star => (
          <label key={star} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-black">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              checked={filters.ratings?.includes(star)}
              onChange={() => onFilterChange("ratings", star)}
            />
            <span className="flex items-center gap-1">
              {Array.from({ length: star }).map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
              &amp; Up
            </span>
          </label>
        ))}
      </FilterSection>

      {/* DEALS & DISCOUNTS */}
      <FilterSection title="Deals & Discounts">
        <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-black">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300"
            checked={filters.dealsOnly || false}
            onChange={e => onFilterChange("dealsOnly", e.target.checked)}
          />
          Show Discounted Only
        </label>
      </FilterSection>

      {/* FOOD FORM */}
      <FilterSection title="Food Form">
        {foodForms.map(form => (
          <label key={form} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-black">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              checked={filters.foodForms?.includes(form)}
              onChange={() => onFilterChange("foodForms", form)}
            />
            {form}
          </label>
        ))}
      </FilterSection>

      {/* SPECIAL DIET */}
      <FilterSection title="Special Diet">
        {specialDiets.map(diet => (
          <label key={diet} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-black">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              checked={filters.specialDiets?.includes(diet)}
              onChange={() => onFilterChange("specialDiets", diet)}
            />
            {diet}
          </label>
        ))}
      </FilterSection>


  return (
    <aside className="w-[280px] shrink-0 sticky top-24 h-fit bg-white border border-gray-200 rounded-xl p-5 overflow-y-auto max-h-[90vh] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[28px] font-semibold text-black">Filter By</h2>
        <button
          className="text-sm text-orange-600 hover:underline font-semibold px-2 py-1 rounded"
          onClick={onClearFilters}
          type="button"
        >
          Clear Filters
        </button>
      </div>

      <FilterSection title="Availability">
        <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-black">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300"
            checked={filters.includeOutOfStock}
            onChange={e => onFilterChange("includeOutOfStock", e.target.checked)}
          />
          Include Out Of Stock
        </label>
      </FilterSection>

      <FilterSection title="Price">
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={filters.price[1]}
          onChange={e => onFilterChange("price", [minPrice, Number(e.target.value)])}
          className="w-full accent-yellow-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>₹{minPrice}</span>
          <span>₹{filters.price[1]}</span>
        </div>
      </FilterSection>

      <FilterSection title="Pet Type">
        {petTypes.map(type => (
          <label key={type} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-black">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              checked={filters.petTypes.includes(type)}
              onChange={() => onFilterChange("petTypes", type)}
            />
            {type}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Brands">
        {brands.map(brand => (
          <label key={brand} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-black">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              checked={filters.brands.includes(brand)}
              onChange={() => onFilterChange("brands", brand)}
            />
            {brand}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Flavor">
        {flavors.map(flavor => (
          <label key={flavor} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-black">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              checked={filters.flavors.includes(flavor)}
              onChange={() => onFilterChange("flavors", flavor)}
            />
            {flavor}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Weight">
        {weights.map(weight => (
          <label key={weight} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-black">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              checked={filters.weights.includes(weight)}
              onChange={() => onFilterChange("weights", weight)}
            />
            {weight}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Pet Life Stages">
        {lifeStages.map(stage => (
          <label key={stage} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-black">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
              checked={filters.lifeStages.includes(stage)}
              onChange={() => onFilterChange("lifeStages", stage)}
            />
            {stage}
          </label>
        ))}
      </FilterSection>
    </aside>
  );
};

export default ShopSidebar;
