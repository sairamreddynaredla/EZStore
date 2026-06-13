import banners from '../../assets/brand-banners'

const BrandBanners = () => {
  const entries = Object.entries(banners)

  if (!entries || entries.length === 0) return null

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Brand Banners</h3>

        <div className="flex gap-6 overflow-x-auto py-2">
          {entries.map(([key, src]) => (
            <div
              key={key}
              className="flex-shrink-0 w-64 h-32 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-3"
            >
              <img src={src} alt={key} className="max-w-full max-h-full object-contain" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandBanners
