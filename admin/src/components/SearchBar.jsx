const SearchBar = ({ value, onChange, placeholder = "Search...", label = "Search", className = "" }) => (
  <label className={`space-y-2 ${className}`}>
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-neutral-border bg-slate-50 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
    />
  </label>
);

export default SearchBar;
