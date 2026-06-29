const FilterGroup = ({ label, children, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <p className="text-sm font-medium text-slate-700">{label}</p>
    {children}
  </div>
);

export default FilterGroup;
