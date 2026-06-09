import { useMemo } from 'react'
import { getFeaturedBrands } from '../../data/brands'
import banners from '../../assets/brand-banners'

// Import all brand logos
import royalCaninLogo from '../../assets/brands/royal-canin.jpeg'
import purinaLogo from '../../assets/brands/purina.jpeg'
import farminaLogo from '../../assets/brands/farmina.jpeg'
import origenLogo from '../../assets/brands/orijen.jpeg'
import droolsLogo from '../../assets/brands/drools.jpeg'
import meoLogo from '../../assets/brands/meo.jpeg'
import kennelKitchenLogo from '../../assets/brands/kennel-kitchen.jpeg'
import whiskasLogo from '../../assets/brands/whiskas.jpeg'
import shebaLogo from '../../assets/brands/sheba.jpeg'
import tasteWildLogo from '../../assets/brands/taste-of-the-wild.jpeg'

// Map brand logo keys to imported images
const logoMap = {
  'royal-canin': royalCaninLogo,
  purina: purinaLogo,
  farmina: farminaLogo,
  orijen: origenLogo,
  drools: droolsLogo,
  meo: meoLogo,
  'kennel-kitchen': kennelKitchenLogo,
  whiskas: whiskasLogo,
  sheba: shebaLogo,
  'taste-of-the-wild': tasteWildLogo,
}

const BrandCard = ({ brand }) => {
  const key = brand.logo
  const logoSrc = logoMap[key] || banners[key] || banners[String(key).replace(/-/g, '')]

  return (
    <div
      className="
        min-w-[240px]
        h-[130px]
        bg-white
        rounded-3xl
        border border-gray-200
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        flex
        items-center
        justify-center
        p-6
        hover:-translate-y-1
      "
    >
      {logoSrc ? (
        <img
          src={logoSrc}
          alt={brand.name}
          className="
            max-w-full
            max-h-full
            object-contain
            transition-transform
            duration-300
            hover:scale-105
          "
        />
      ) : (
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{brand.name}</p>
        </div>
      )}
    </div>
  )
}

const BrandsSection = () => {
  const featuredBrands = useMemo(() => getFeaturedBrands(), [])

  // Split brands into two rows
  const midpoint = Math.ceil(featuredBrands.length / 2)
  const topBrands = featuredBrands.slice(0, midpoint)
  const bottomBrands = featuredBrands.slice(midpoint)

  return (
    <section className="py-20 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Trusted Pet Brands
          </h2>

          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            Premium food & care brands trusted by pet parents worldwide
          </p>
        </div>

        {/* TOP ROW */}
        <div className="mb-8 overflow-hidden">
          <div className="flex gap-6 w-max animate-left">
            {[...topBrands, ...topBrands].map((brand, index) => (
              <BrandCard key={`${brand.id}-top-${index}`} brand={brand} />
            ))}
          </div>
        </div>

        {/* BOTTOM ROW */}
        {bottomBrands.length > 0 && (
          <div className="overflow-hidden">
            <div className="flex gap-6 w-max animate-right">
              {[...bottomBrands, ...bottomBrands].map((brand, index) => (
                <BrandCard key={`${brand.id}-bottom-${index}`} brand={brand} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes scrollLeft {
            0% {
              transform: translateX(0);
            }

            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes scrollRight {
            0% {
              transform: translateX(-50%);
            }

            100% {
              transform: translateX(0);
            }
          }

          .animate-left {
            animation: scrollLeft 28s linear infinite;
          }

          .animate-right {
            animation: scrollRight 28s linear infinite;
          }

          .animate-left:hover,
          .animate-right:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </section>
  )
}

export default BrandsSection