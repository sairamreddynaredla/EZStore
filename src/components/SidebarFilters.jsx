

const SidebarFilters = ({ filters, onChange }) => {
  // Example: filters = { availability: true, price: [0, 1000], ... }
  return (
    <aside className="w-64 bg-white rounded-xl shadow p-5 border border-gray-200">
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2 text-[#1F6B52]">Filter By</h3>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.includeOutOfStock || false}
              onChange={e => onChange({ ...filters, includeOutOfStock: e.target.checked })}
            />
            Include Out Of Stock
          </label>
        </div>
        {/* Add more filters as needed */}
      </div>
    </aside>
  );
};

export default SidebarFilters;
