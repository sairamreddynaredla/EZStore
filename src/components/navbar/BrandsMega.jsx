import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { brands } from '../../data/brands'
import banners from '../../assets/brand-banners'
import spotlightData from '../../data/spotlight'
import royalCaninLogo from '../../assets/brands/royal-canin.jpeg'

const logoMap = {
  'royal-canin': royalCaninLogo,
}

const BrandsMega = ({ isOpen, onOpen, onClose }) => {
  const rootRef = useRef(null)
  const dropdownRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [topOffset, setTopOffset] = useState(0)

  useEffect(() => setOpen(!!isOpen), [isOpen])

  useEffect(() => {
    const header = document.querySelector('header')
    const update = () => header && setTopOffset(header.offsetHeight)
    update()
    window.addEventListener('resize', update)
    const onDocClick = (e) => {
      if (rootRef.current && dropdownRef.current && !rootRef.current.contains(e.target) && !dropdownRef.current.contains(e.target)) {
        onClose && onClose()
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => {
      window.removeEventListener('resize', update)
      document.removeEventListener('mousedown', onDocClick)
    }
  }, [onClose])

  const allBrands = Array.isArray(brands) ? [...brands].sort((a, b) => a.name.localeCompare(b.name)) : []
  const letters = ['All', ...Array.from(new Set(allBrands.map((b) => (b.name || '').charAt(0).toUpperCase())))]

  const [search, setSearch] = useState('')
  const [selectedLetter, setSelectedLetter] = useState('All')
  const [selectedTab, setSelectedTab] = useState('Popular')

  const filteredBrandList = allBrands.filter((brand) => {
    const matchesSearch = (brand.name || '').toLowerCase().includes(search.toLowerCase())
    const matchesLetter = selectedLetter === 'All' || (brand.name || '').startsWith(selectedLetter)
    return matchesSearch && matchesLetter
  })

  const spotlightImages = Array.isArray(spotlightData) && spotlightData.length ? spotlightData : Object.entries(banners || {}).slice(0, 3).map(([k, v]) => ({ image: v, title: k, link: `/brands/${k}` }))

  const popularOrder = ['whiskas', 'pedigree', 'acana', 'orijen', 'applaws', 'meo', 'temptations']

  return (
    <div ref={rootRef} className="relative">
      <button onFocus={() => onOpen && onOpen()} onMouseEnter={() => onOpen && onOpen()} className="px-4 py-2 font-semibold text-gray-800 hover:text-primary-600 transition-all">Brands</button>

      <div ref={dropdownRef} style={{ top: topOffset }} className={"absolute left-0 right-0 z-50 transition-all duration-150 " + (open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none')}>
        <div className="bg-white shadow-2xl py-4 md:py-6">
          <div className="w-full px-8 bg-white">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-2">
                <div className="bg-white rounded-3xl border border-gray-100 p-4">
                  <h4 className="font-bold mb-3">All Brands</h4>
                  <div className="mb-3">
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search Brand"
                      className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="flex">
                    <div className="w-10 pr-2">
                      <ul className="space-y-2 text-sm text-gray-500 sticky top-6">
                        {letters.map((letter) => (
                          <li key={letter}>
                            <button
                              type="button"
                              onClick={() => setSelectedLetter(letter)}
                              className={`w-full text-left py-1 transition flex items-center ${selectedLetter === letter ? 'text-[#E53935] font-bold' : 'hover:text-[#1F6B52]'}`}
                            >
                              <span className={`h-6 w-1 mr-2 ${selectedLetter === letter ? 'bg-[#E53935]' : 'bg-transparent'} rounded-md`} />
                              <span className="ml-1">{letter}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex-1 pl-2">
                      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                        {filteredBrandList.map((brand) => (
                          <Link
                            key={brand.id || brand.slug}
                            to={`/brands/${brand.slug}`}
                            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-[#1F6B52] hover:bg-[#F5FBF6] transition"
                            onClick={() => onClose && onClose()}
                          >
                            <img src={logoMap[brand.logo] || banners[brand.logo] || royalCaninLogo} alt={brand.name} className="h-8 w-8 object-contain" />
                            <span>{brand.name}</span>
                          </Link>
                        ))}
                        {filteredBrandList.length === 0 && <p className="text-sm text-gray-500">No brands match your search.</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setSelectedTab('Popular')} className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedTab === 'Popular' ? 'bg-[#1F6B52] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>
                      Popular
                    </button>
                    <button type="button" onClick={() => setSelectedTab('Emerging')} className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedTab === 'Emerging' ? 'bg-[#1F6B52] text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>
                      Emerging
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                    {(selectedTab === 'Popular'
                      ? popularOrder.map((slug) => filteredBrandList.find((b) => b.slug === slug || b.logo === slug)).filter(Boolean)
                      : filteredBrandList.filter((b) => !b.featured)
                    ).map((brand) => (
                      <Link key={brand.id || brand.slug} to={`/brands/${brand.slug}`} className="group block rounded-2xl bg-white border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 overflow-hidden flex items-center justify-center p-4" onClick={() => onClose && onClose()}>
                        <div className="w-full h-24 flex items-center justify-center bg-white">
                          <img src={logoMap[brand.logo] || royalCaninLogo} alt={brand.name} className="max-h-20 max-w-full object-contain" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-2 pr-6">
                <h4 className="font-bold mb-3">Brand Spotlight</h4>
                <div className="space-y-3">
                  {spotlightImages.map((s, idx) => (
                    <Link key={idx} to={s.link} className="block rounded-xl overflow-hidden border border-gray-100 bg-white" onClick={() => onClose && onClose()}>
                      <div className="w-full h-24 flex items-center justify-center bg-white">
                        <img src={s.image} alt="" className="max-w-full max-h-full object-contain" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandsMega
