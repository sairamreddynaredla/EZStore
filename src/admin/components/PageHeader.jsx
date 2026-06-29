const PageHeader = ({ title, description, actions, className = "" }) => (
  <header
    className={`flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between ${className}`}
  >
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
    {actions ? <div className="flex flex-wrap justify-end gap-3 sm:flex-row sm:items-center">{actions}</div> : null}
  </header>
);

export default PageHeader;
