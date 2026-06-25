// ...existing code...

const CategoryHero = ({ title, subtitle, highlights, image, breadcrumbs, imagePosition }) => (
  <section className="w-full rounded-4xl mb-8 overflow-hidden bg-white border border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:px-12 md:py-12">
      {breadcrumbs && (
        <nav className="mb-4 text-xs text-gray-500 flex flex-wrap gap-2">
          {breadcrumbs.map((crumb, idx) => (
            <span key={(crumb && crumb.path) || idx} className="flex items-center gap-2">
              <span>{crumb.label || crumb}</span>
              {idx < breadcrumbs.length - 1 && <span className="text-gray-400">&gt;</span>}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{title}</h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-3xl mb-6">{subtitle}</p>
      {highlights && highlights.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-3 border border-slate-200"
            >
              {h.icon && (
                <img src={h.icon} alt="" className="w-6 h-6 object-contain" loading="lazy" />
              )}
              <span className="text-sm font-semibold text-slate-800">{h.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
    {image && (
      <div className="relative w-full overflow-hidden">
        <img
          src={image}
          alt={title || "banner"}
          className="w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] object-cover object-top"
          style={{ objectPosition: imagePosition || "top center" }}
          loading="lazy"
        />

        {/* arrows removed */}
      </div>
    )}
  </section>
);

export default CategoryHero;
