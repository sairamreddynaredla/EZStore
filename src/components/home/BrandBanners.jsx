import banners from "../../assets/brand-banners";

const BrandBanners = () => {
  const entries = Object.entries(banners);
  const visible = entries.slice(0, 4);

  if (!entries || entries.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Brand Banners</h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 py-2">
          {visible.map(([key, src]) => (
            <div
              key={key}
              className="w-full h-40 sm:h-48 md:h-40 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-3"
            >
              <img src={src} alt={key} className="w-full h-full object-contain" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandBanners;
