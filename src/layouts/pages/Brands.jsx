import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { brands } from '../../data/brands'

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
import acanaLogo from '../../assets/brands/acana.jpeg'
import goodiesLogo from '../../assets/brands/goodies.jpeg'
import smartheartLogo from '../../assets/brands/smartheart.jpeg'
import jerhighLogo from '../../assets/brands/jerhigh.jpeg'
import himalayaLogo from '../../assets/brands/himalaya.jpeg'
import banners from '../../assets/brand-banners'
import spotlightData from '../../data/spotlight'
import blueBuffaloLogo from '../../assets/brands/BlueBuffelopng.png'
import temptationsLogo from '../../assets/brands/temptaions..jpeg'


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
  acana: acanaLogo,
  goodies: goodiesLogo,
  smartheart: smartheartLogo,
  jerhigh: jerhighLogo,
  himalaya: himalayaLogo,
  'blue-buffalo': blueBuffaloLogo,
  temptations: temptationsLogo,
}

const BrandsPage = () => {
  const [search, setSearch] = useState('')
  const [selectedLetter, setSelectedLetter] = useState('All')
  const [selectedTab, setSelectedTab] = useState('Popular')

  const allBrands = useMemo(
    () => [...brands].sort((a, b) => a.name.localeCompare(b.name)),
    []
  )

  const letters = useMemo(
    () => [
      'All',
      ...Array.from(new Set(allBrands.map((brand) => brand.name.charAt(0).toUpperCase()))),
    ],
    [allBrands]
  )

  const filteredBrandList = useMemo(() => {
    return allBrands.filter((brand) => {
      const matchesSearch = brand.name.toLowerCase().includes(search.toLowerCase())
      const matchesLetter =
        selectedLetter === 'All' || brand.name.startsWith(selectedLetter)
      return matchesSearch && matchesLetter
    })
  }, [allBrands, search, selectedLetter])

  const spotlightImages = (spotlightData && spotlightData.length)
    ? spotlightData
    : Object.entries(banners)
        .slice(0, 3)
        .map(([key, image]) => ({
          image,
          title: String(key).replace(/-/g, ' '),
          cta: '',
          link: `/brands/${key}`,
        }))

  const popularOrder = [
    'whiskas',
    'pedigree',
    'acana',
    'orijen',
    'applaws',
    'meo',
    'temptations',
  ]

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <Navbar />

      <div className="max-w-8xl mx-auto px-8 md:px-16 lg:px-20 py-8">

        <div className="grid grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)_240px] gap-8">
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="mb-4">
                <label htmlFor="brand-search" className="sr-only">
                  Search Brand
                </label>
                <input
                  id="brand-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Brand"
                  className="w-full border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1F6B52]"
                />
              </div>
              

              <div className="flex">
                {/* Vertical letters column */}
                <div className="w-10 pr-2">
                  <ul className="space-y-2 text-sm text-gray-500 sticky top-6">
                    {letters.map((letter) => (
                      <li key={letter}>
                        <button
                          type="button"
                          onClick={() => setSelectedLetter(letter)}
                          className={`w-full text-left py-1 transition ${
                            selectedLetter === letter
                              ? 'text-[#E53935] font-bold'
                              : 'hover:text-[#1F6B52]'
                          }`}
                        >
                          {letter}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Brand list with small logos */}
                <div className="flex-1 pl-4">
                  <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                    {filteredBrandList.map((brand) => (
                      <Link
                        key={brand.id}
                        to={`/brands/${brand.slug}`}
                        className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-[#1F6B52] hover:bg-[#F5FBF6] transition"
                      >
                        <img src={logoMap[brand.logo] || banners[brand.logo] || banners[String(brand.logo).replace(/-/g, '')] || royalCaninLogo} alt={brand.name} className="h-8 w-8 object-contain" />
                        <span>{brand.name}</span>
                      </Link>
                    ))}
                    {filteredBrandList.length === 0 && (
                      <p className="text-sm text-gray-500">No brands match your search.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTab('Popular')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedTab === 'Popular'
                      ? 'bg-[#1F6B52] text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Popular
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('Emerging')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedTab === 'Emerging'
                      ? 'bg-[#1F6B52] text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Emerging
                </button>
              </div>

              <p className="text-sm text-gray-500">Showing {filteredBrandList.filter((b) => (selectedTab === 'Popular' ? b.featured : !b.featured)).length} brands</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 items-stretch">
              {selectedTab === 'Popular'
                ? // render in explicit popularOrder, falling back to featured brands that match
                  popularOrder
                    .map((slug) => filteredBrandList.find((b) => b.slug === slug || b.logo === slug))
                    .filter(Boolean)
                    .map((brand) => (
                      <Link
                        key={brand.id}
                        to={`/brands/${brand.slug}`}
                        className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 overflow-hidden flex items-center justify-center p-4"
                        aria-label={brand.name}
                      >
                        <div className="w-full h-24 flex items-center justify-center bg-white">
                          <img
                            src={logoMap[brand.logo] || royalCaninLogo}
                            alt={brand.name}
                            className="max-h-20 max-w-full object-contain"
                          />
                        </div>
                      </Link>
                    ))
                : // Emerging: show non-featured brands
                  filteredBrandList
                    .filter((b) => !b.featured)
                    .map((brand) => (
                      <Link
                        key={brand.id}
                        to={`/brands/${brand.slug}`}
                        className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 overflow-hidden flex items-center justify-center p-4"
                        aria-label={brand.name}
                      >
                        <div className="w-full h-28 flex items-center justify-center bg-white">
                          <img
                            src={logoMap[brand.logo] || royalCaninLogo}
                            alt={brand.name}
                            className="max-h-20 max-w-full object-contain"
                          />
                        </div>
                      </Link>
                    ))}
            </div>
          </main>

          <aside className="block">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-4xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-2">Brand Spotlight</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get the latest offers on premium brands and shop top-rated products curated for your pet.
                </p>
                <div className="space-y-4">
                  {spotlightImages.map((s, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-gray-100 bg-white">
                      <Link to={s.link || '/brands'} className="block">
                        <div className="w-full h-40 sm:h-44 md:h-44 lg:h-40 overflow-hidden bg-white flex items-center justify-center">
                          <img src={s.image} alt={s.title} className="max-w-full max-h-full object-contain" loading="lazy" />
                        </div>
                      </Link>
                      {s.cta && (
                        <div className="p-4">
                          <div className="inline-flex items-center justify-between w-full rounded-full border border-gray-200 px-4 py-3 bg-white">
                            <span className="text-sm font-semibold">{s.cta}</span>
                            <span className="ml-2 text-gray-500">→</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* "Why shop brands here?" section removed as requested */}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BrandsPage
