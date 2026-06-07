import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { brands } from '../../data/brands'

import royalCaninLogo from '../../assets/brands/royal-canin.jpeg'
import pedigreeLogo from '../../assets/brands/pedigree.jpeg'
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
}

const BrandsPage = () => {
  const [activeTab, setActiveTab] = useState('popular')
  const [search, setSearch] = useState('')
  const [selectedLetter, setSelectedLetter] = useState('All')

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

  const popularBrands = useMemo(
    () => allBrands.filter((brand) => brand.featured),
    [allBrands]
  )

  const emergingBrands = useMemo(
    () => allBrands.filter((brand) => !brand.featured),
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

  const displayedBrands = useMemo(() => {
    return (activeTab === 'popular' ? popularBrands : emergingBrands).filter(
      (brand) =>
        brand.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedLetter === 'All' || brand.name.startsWith(selectedLetter))
    )
  }, [activeTab, emergingBrands, popularBrands, search, selectedLetter])

  const spotlightItems = [
    {
      title: 'Upto 15% OFF',
      description: 'Top picks from Applod with best-seller packs for happy pets.',
      image: acanaLogo,
    },
    {
      title: 'Upto 50% OFF',
      description: 'Fresh grooming and lifestyle essentials for every breed.',
      image: droolsLogo,
    },
    {
      title: 'Featured Brands',
      description: 'Explore premium nutrition brands and latest launches.',
      image: royalCaninLogo,
    },
  ]

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0D2B5C] mb-4">
            All Brands
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Search your favorite pet brands, browse top picks, and explore emerging labels in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_320px] gap-8">
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="mb-6">
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
              <h2 className="text-xl font-semibold text-slate-900 mb-4">All Brands</h2>
              <div className="flex flex-wrap gap-2 mb-5">
                {letters.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setSelectedLetter(letter)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                      selectedLetter === letter
                        ? 'bg-[#1F6B52] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {filteredBrandList.map((brand) => (
                  <Link
                    key={brand.id}
                    to={`/brands/${brand.slug}`}
                    className="block rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:border-[#1F6B52] hover:bg-[#F5FBF6] transition"
                  >
                    {brand.name}
                  </Link>
                ))}
                {filteredBrandList.length === 0 && (
                  <p className="text-sm text-gray-500">No brands match your search.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Brand Spotlight</h3>
              <div className="space-y-4">
                {spotlightItems.map((item) => (
                  <div key={item.title} className="rounded-3xl bg-[#F8FAFF] p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-16 w-16 rounded-3xl bg-white p-3 flex items-center justify-center shadow-sm">
                        <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <Link
                      to="/brands"
                      className="inline-flex items-center justify-center rounded-full bg-[#1F6B52] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Shop Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-3 rounded-full bg-white p-2 shadow-sm border border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('popular')}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                    activeTab === 'popular'
                      ? 'bg-[#1F6B52] text-white'
                      : 'text-gray-600 hover:text-[#1F6B52]'
                  }`}
                >
                  Popular
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('emerging')}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                    activeTab === 'emerging'
                      ? 'bg-[#1F6B52] text-white'
                      : 'text-gray-600 hover:text-[#1F6B52]'
                  }`}
                >
                  Emerging
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Showing {displayedBrands.length} brands
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brands/${brand.slug}`}
                  className="group block rounded-4xl bg-white border border-gray-100 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-transform duration-300"
                >
                  <div className="flex h-40 items-center justify-center rounded-3xl bg-[#F5F7FB] p-6">
                    <img
                      src={logoMap[brand.logo] || royalCaninLogo}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="mt-5 text-center">
                    <h2 className="text-lg font-semibold text-[#0F172A]">{brand.name}</h2>
                    <p className="text-sm text-gray-500 mt-2">
                      {brand.featured ? 'Trusted popular brand' : 'Emerging pet brand'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </main>

          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-4xl bg-[#1F6B52] p-6 text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Brand Spotlight</h3>
                <p className="text-sm text-slate-200 mb-6">
                  Get the latest offers on premium brands and shop top-rated products curated for your pet.
                </p>
                <div className="flex items-center gap-4 bg-white/10 rounded-[28px] p-4">
                  <div className="h-16 w-16 rounded-3xl bg-white p-3 flex items-center justify-center">
                    <img src={royalCaninLogo} alt="Spotlight" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-200">Exclusive</p>
                    <p className="text-lg font-bold">15% off select packs</p>
                  </div>
                </div>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1F6B52] shadow-md transition hover:bg-slate-100"
                >
                  Explore Offers
                </Link>
              </div>
              <div className="rounded-4xl bg-white border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Why shop brands here?</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li>Curated selection of trusted pet brands</li>
                  <li>Fast delivery and exclusive deals</li>
                  <li>Easy navigation and brand discovery</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BrandsPage
