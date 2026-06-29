const SettingsCard = ({ title, description, children, className = "" }) => (
  <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
    </div>
    <div className="space-y-6">{children}</div>
  </section>
);

export default SettingsCard;
