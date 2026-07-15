const STATUS_STYLES = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-sky-100 text-sky-700",
  neutral: "bg-slate-100 text-slate-700",
};

const Badge = ({ label, tone = "neutral", className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[tone] ?? STATUS_STYLES.neutral} ${className}`}>
    {label}
  </span>
);

export default Badge;
