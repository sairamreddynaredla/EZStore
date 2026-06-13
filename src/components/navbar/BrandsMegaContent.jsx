import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import banners from '../../assets/brand-banners';
import { brands } from '../../data/brands';
import { products } from '../../data/products';
import ProductGrid from '../products/ProductGrid';
import BrandSidebar from '../BrandSidebar';

// Load spotlight images (eager) and normalize to { key, image }
const spotlightFiles = import.meta.glob('../../assets/spotlight/*.{png,jpg,jpeg,webp,svg}', { eager: true });
const spotlightEntries = Object.entries(spotlightFiles || {}).map(([path, mod]) => {
  const fileName = path.split('/').pop().replace(/\.[^/.]+$/, '');
  const key = String(fileName).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const image = (mod && (mod.default || mod)) || '';
  return { key, image };
});

const popularOrder = ['whiskas','pedigree','acana','orijen','applaws','meo','temptations','blue-buffalo'];

export default function BrandsMegaContent({ onClose }){
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [selectedTab, setSelectedTab] = useState('Popular');
  const [selectedSpotlight, setSelectedSpotlight] = useState(null);

  const allBrands = useMemo(()=> [...brands].sort((a,b)=>a.name.localeCompare(b.name)), []);
  const letters = useMemo(()=> ['All', ...Array.from(new Set(allBrands.map(b=>b.name.charAt(0).toUpperCase())) )], [allBrands]);

  const filteredBrandList = useMemo(()=>{
    return allBrands.filter((brand)=>{
      const matchesSearch = brand.name.toLowerCase().includes(search.toLowerCase());
      const matchesLetter = selectedLetter === 'All' || brand.name.startsWith(selectedLetter);
      const matchesTab = selectedTab === 'Popular' ? !!brand.featured : !brand.featured;
      return matchesSearch && matchesLetter && matchesTab;
    });
  }, [allBrands, search, selectedLetter, selectedTab]);

  const spotlightProducts = useMemo(()=>{
    if (!selectedSpotlight) return [];
    const brandObj = brands.find(b => b.slug === selectedSpotlight || b.logo === selectedSpotlight || String(b.name).toLowerCase() === selectedSpotlight);
    const brandName = brandObj?.name || selectedSpotlight;
    return (products||[]).filter(p => String(p.brand||'').toLowerCase() === String(brandName||'').toLowerCase()).slice(0,20);
  }, [selectedSpotlight]);

  return (
    <div className="w-full max-w-6xl">
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-3">
          {selectedSpotlight ? (
            <BrandSidebar selectedBrand={selectedSpotlight} onClose={onClose} />
          ) : (
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <label htmlFor="brand-search" className="sr-only">Search Brand</label>
              <input id="brand-search" type="search" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search Brand" className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm" />
              <h3 className="mt-4 text-lg font-bold">All Brands</h3>
              <div className="flex mt-4">
                <div className="w-10 pr-3">
                  <ul className="space-y-2 text-sm text-gray-500 sticky top-4">
                    {letters.map(letter => (
                      <li key={letter}>
                        <button type="button" onClick={()=>setSelectedLetter(letter)} className={`w-full text-left py-1 transition flex items-center ${selectedLetter===letter ? 'text-[#E53935] font-bold' : 'hover:text-[#1F6B52]'}`}>
                          <span className={`h-6 w-1 mr-2 ${selectedLetter===letter ? 'bg-[#E53935]' : 'bg-transparent'} rounded-md`} />
                          <span className="ml-1">{letter}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 pl-2 max-h-[50vh] overflow-y-auto pr-2">
                  {filteredBrandList.map(brand => (
                    <Link key={brand.id} to={`/brands/${brand.slug || brand.logo}`} onClick={() => onClose && onClose()} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-[#1F6B52] hover:bg-[#F5FBF6] transition mb-2">
                      <span className="pl-1">{brand.name}</span>
                    </Link>
                  ))}
                  {filteredBrandList.length===0 && <p className="text-sm text-gray-500">No brands match your search.</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-7">
          {selectedSpotlight ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{(brands.find(b => b.slug === selectedSpotlight || b.logo === selectedSpotlight)?.name) || selectedSpotlight}</h2>
                  <p className="text-sm text-gray-500">Showing up to 20 products</p>
                </div>
                <div>
                  <button type="button" onClick={() => setSelectedSpotlight(null)} className="text-sm text-[#1F6B52] hover:underline">Back</button>
                </div>
              </div>
              <ProductGrid products={spotlightProducts} />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <div className="flex items-center gap-6">
                  <button type="button" onClick={() => setSelectedTab('Popular')} className="relative text-sm font-semibold py-1 px-1 text-gray-700 hover:text-[#1F6B52]">
                    <span className={selectedTab === 'Popular' ? 'text-[#E53935]' : ''}>Popular</span>
                    <span className={selectedTab === 'Popular' ? 'block mt-2 mx-auto h-1 w-10 rounded bg-[#E53935]' : 'block mt-2 mx-auto h-1 w-10 rounded bg-transparent'} />
                  </button>

                  <button type="button" onClick={() => setSelectedTab('Emerging')} className="relative text-sm font-semibold py-1 px-1 text-gray-700 hover:text-[#1F6B52]">
                    <span className={selectedTab === 'Emerging' ? 'text-[#E53935]' : ''}>Emerging</span>
                    <span className={selectedTab === 'Emerging' ? 'block mt-2 mx-auto h-1 w-10 rounded bg-[#E53935]' : 'block mt-2 mx-auto h-1 w-10 rounded bg-transparent'} />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Showing {selectedTab === 'Popular' ? popularOrder.map(slug => filteredBrandList.find(b => b.slug === slug || b.logo === slug)).filter(Boolean).length : filteredBrandList.filter(b => !b.featured).length} brands</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                {selectedTab === 'Popular' ? (
                  popularOrder
                    .map(slug => filteredBrandList.find(b => b.slug === slug || b.logo === slug))
                    .filter(Boolean)
                    .map(brand => (
                      <Link
                        key={brand.id}
                        to={`/brands/${brand.slug || brand.logo}`}
                        onClick={() => onClose && onClose()}
                        className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 overflow-hidden flex items-center justify-center p-4"
                      >
                        <div className="w-full h-24 flex items-center justify-center bg-white">
                          <img
                            src={banners[brand.logo] || banners[brand.slug] || (brand.logo && `/src/assets/brands/${brand.logo}.jpeg`) || '/assets/placeholder-product.svg'}
                            alt={brand.name}
                            className="max-h-20 max-w-full object-contain"
                          />
                        </div>
                      </Link>
                    ))
                ) : (
                  filteredBrandList.map(brand => (
                    <Link
                      key={brand.id}
                      to={`/brands/${brand.slug || brand.logo}`}
                      onClick={() => onClose && onClose()}
                      className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 overflow-hidden flex items-center justify-center p-4"
                    >
                      <div className="w-full h-28 flex items-center justify-center bg-white">
                        <img
                          src={banners[brand.logo] || banners[brand.slug] || (brand.logo && `/src/assets/brands/${brand.logo}.jpeg`) || '/assets/placeholder-product.svg'}
                          alt={brand.name}
                          className="max-h-20 max-w-full object-contain"
                        />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-2">
          <div className="sticky top-4 space-y-4">
            <h3 className="text-lg font-bold">Brand Spotlight</h3>
            <div className="space-y-3">
              {spotlightEntries.slice(0,3).map((s, idx)=> (
                <Link key={idx} to={`/brands/${s.key}?preset=dog-puppy-food`} onClick={() => onClose && onClose()} className={`w-full block rounded-2xl overflow-hidden border ${selectedSpotlight===s.key ? 'border-[#1F6B52]' : 'border-gray-100'} bg-white`}>
                  <div className="w-full h-28 overflow-hidden bg-white flex items-center justify-center">
                    <img src={banners[s.key] || s.image} alt={s.key} className="max-w-full max-h-full object-contain" loading="lazy" />
                  </div>
                </Link>
              ))}
            </div>
            {selectedSpotlight && (
              <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-3">
                <h4 className="font-semibold mb-2">Related Products</h4>
                <ul className="space-y-3 max-h-64 overflow-y-auto">
                  {spotlightProducts.length===0 && <li className="text-sm text-gray-500">No products found for this brand.</li>}
                  {spotlightProducts.map(p=> (
                    <li key={p.id} className="flex items-center gap-3">
                      <Link to={`/product/${p.id}`} onClick={() => onClose && onClose()} className="flex items-center gap-3">
                        <img src={p.image || (p.images && p.images[0]) || '/assets/placeholder-product.svg'} alt={p.name} className="h-12 w-12 object-contain rounded-md bg-white border" loading="lazy" />
                        <div className="text-sm">
                          <div className="font-medium text-gray-800">{p.name}</div>
                          <div className="text-xs text-gray-500">${(p.price || p.variants?.[0]?.price || '').toString()}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
