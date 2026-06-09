import { useState } from "react";

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 border-b pb-2">
      <button
        className="w-full flex justify-between items-center font-semibold py-2 focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span>{open ? "-" : "+"}</span>
      </button>
      {open && <div className="pl-2 pt-2">{children}</div>}
    </div>
  );
};

const ProductFilterSidebar = ({ filters, selectedFilters, onFilterChange, isMobileOpen, setIsMobileOpen }) => {
  return (
    <>
      {/* Mobile Toggle Button - Only visible on mobile */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden w-full mb-4 px-4 py-2 bg-[#1F6B52] text-white rounded-lg font-semibold flex items-center justify-center gap-2"
        aria-expanded={isMobileOpen}
      >
        <span>{isMobileOpen ? "✕" : "☰"}</span>
        {isMobileOpen ? "Close Filters" : "Show Filters"}
      </button>

      {/* Mobile Overlay Background */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Filter Sidebar */}
      <aside className={`w-72 p-4 border-r bg-white self-start sticky top-24 transition-all duration-300 ${
        isMobileOpen ? "fixed left-0 top-0 z-50 w-72 h-screen overflow-y-auto rounded-r-lg shadow-lg" : "hidden md:block"
      }`}>
    <h2 className="font-bold text-lg mb-4">Filter By</h2>
    <CollapsibleSection title="Brands" defaultOpen>
      {filters.brands.map((brand) => (
        <label key={brand.name} className="flex items-center mb-1 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedFilters.brands.includes(brand.name)}
            onChange={() => onFilterChange("brands", brand.name)}
            className="mr-2"
          />
          <span>{brand.name} <span className="text-gray-500">({brand.count})</span></span>
        </label>
      ))}
    </CollapsibleSection>
    <CollapsibleSection title="Breed Size">
      {filters.breedSize.map((size) => (
        <label key={size.name} className="flex items-center mb-1 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedFilters.breedSize.includes(size.name)}
            onChange={() => onFilterChange("breedSize", size.name)}
            className="mr-2"
          />
          <span>{size.name} <span className="text-gray-500">({size.count})</span></span>
        </label>
      ))}
    </CollapsibleSection>
    <CollapsibleSection title="Product Type">
      {filters.productType.map((type) => (
        <label key={type.name} className="flex items-center mb-1 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedFilters.productType.includes(type.name)}
            onChange={() => onFilterChange("productType", type.name)}
            className="mr-2"
          />
          <span>{type.name} <span className="text-gray-500">({type.count})</span></span>
        </label>
      ))}
    </CollapsibleSection>
    <CollapsibleSection title="Price Range">
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min={filters.price.min}
          max={filters.price.max}
          value={selectedFilters.price[0]}
          onChange={e => onFilterChange("price", [Number(e.target.value), selectedFilters.price[1]])}
          className="w-16 border rounded px-1"
        />
        <span>-</span>
        <input
          type="number"
          min={filters.price.min}
          max={filters.price.max}
          value={selectedFilters.price[1]}
          onChange={e => onFilterChange("price", [selectedFilters.price[0], Number(e.target.value)])}
          className="w-16 border rounded px-1"
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">Min: ${filters.price.min} Max: ${filters.price.max}</div>
    </CollapsibleSection>
    {/* Add more filter sections as needed */}
    </aside>
    </>
  );
};

export default ProductFilterSidebar;
