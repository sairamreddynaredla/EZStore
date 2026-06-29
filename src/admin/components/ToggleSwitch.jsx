const ToggleSwitch = ({ label, description, checked, onChange, disabled = false }) => (
  <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
    <div className="min-w-0 pr-3">
      <p className="font-semibold text-slate-900 whitespace-normal">{label}</p>
      {description ? <p className="mt-1 text-sm text-slate-500 whitespace-normal">{description}</p> : null}
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 h-9 w-16 items-center rounded-full p-1 transition duration-200 ${checked ? "bg-blue-600 hover:bg-blue-500" : "bg-slate-200 hover:bg-slate-300"} ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer focus:outline-none"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <span
        className={`inline-block h-7 w-7 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-7" : "translate-x-0"}`}
      />
    </button>
  </div>
);

export default ToggleSwitch;
