const ToggleSwitch = ({ label, description, checked, onChange, disabled = false }) => (
  <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
    <div className="min-w-0 pr-3">
      <p className="font-semibold text-slate-900 whitespace-normal">{label}</p>
      {description ? <p className="mt-1 text-sm text-slate-500 whitespace-normal">{description}</p> : null}
    </div>

    <button
      type="button"
      aria-pressed={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex flex-shrink-0 h-8 w-16 items-center rounded-full px-1 transition-colors duration-150 ${checked ? "bg-primary-600" : "bg-slate-300"} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      // improve keyboard focus visibility
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-150 ${checked ? "translate-x-8" : "translate-x-0"} ring-1 ring-slate-200 border border-slate-200`}
      />
    </button>
  </div>
);

export default ToggleSwitch;
