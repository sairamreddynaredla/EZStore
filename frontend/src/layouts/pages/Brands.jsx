import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { brands } from "../../data/brands";
import SEO from "../../components/SEO";
import api from "../../services/api";

import royalCaninLogo from "../../assets/brands/royal-canin.webp";
import purinaLogo from "../../assets/brands/purina.webp";
import pedigreeLogo from "../../assets/brands/pedigree.webp";
import farminaLogo from "../../assets/brands/farmina.webp";
import origenLogo from "../../assets/brands/orijen.webp";
import droolsLogo from "../../assets/brands/drools.webp";
import meoLogo from "../../assets/brands/meo.webp";
import kennelKitchenLogo from "../../assets/brands/kennel-kitchen.webp";
import whiskasLogo from "../../assets/brands/whiskas.webp";
import shebaLogo from "../../assets/brands/sheba.webp";
import tasteWildLogo from "../../assets/brands/taste-of-the-wild.webp";
import goodiesLogo from "../../assets/brands/goodies.webp";
import jerhighLogo from "../../assets/brands/jerhigh.webp";
import himalayaLogo from "../../assets/brands/himalaya.webp";
import smartheartLogo from "../../assets/brands/smartheart.webp";
import temptationsLogo from "../../assets/brands/temptations.webp";
import banners from "../../assets/brand-banners";
import ezstoreLogo from "../../assets/logo/ezstore-logo-optimized.webp";

const logoMap = {
  "royal-canin": royalCaninLogo,
  purina: purinaLogo,
  pedigree: pedigreeLogo,
  farmina: farminaLogo,
  orijen: origenLogo,
  drools: droolsLogo,
  meo: meoLogo,
  "kennel-kitchen": kennelKitchenLogo,
  whiskas: whiskasLogo,
  sheba: shebaLogo,
  "taste-of-the-wild": tasteWildLogo,
  goodies: goodiesLogo,
  jerhigh: jerhighLogo,
  himalaya: himalayaLogo,
  smartheart: smartheartLogo,
  temptations: temptationsLogo,
  // Brands without physical logo files - fallback to banners
  applaws: banners["applaws"] || null,
  catmos: banners["catmos"] || null,
  imaginelles: banners["imaginelles"] || null,
  applod: banners["applod"] || null,
  carniwel: banners["carniwel"] || null,
  ezstore: ezstoreLogo,
};

const getBrandLogoSrc = (brand) =>
  logoMap[brand.logo] || banners[brand.logo] || banners[String(brand.logo || "").replace(/-/g, "")] || null;

const BrandsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [databaseBrands, setDatabaseBrands] = useState([]);

  useEffect(() => {
    let active = true;
    api.get("/brands")
      .then((response) => {
        const items = response?.data?.data?.items;
        if (active && Array.isArray(items)) {
          setDatabaseBrands(items.map((brand) => ({ ...brand, logo: brand.slug, featured: false, hidden: false })));
        }
      })
      .catch(() => {
        // The bundled list remains available if the public API is offline.
      });
    return () => { active = false; };
  }, []);

  const allBrands = useMemo(() => {
    const merged = new Map(brands.map((brand) => [brand.slug, brand]));
    databaseBrands.forEach((brand) => merged.set(brand.slug, { ...merged.get(brand.slug), ...brand }));
    return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [databaseBrands]);

  const letters = useMemo(
    () => [
      "All",
      ...Array.from(new Set(allBrands.map((brand) => brand.name.charAt(0).toUpperCase()))),
    ],
    [allBrands]
  );

  const filteredBrandList = useMemo(() => {
    return allBrands.filter((brand) => {
      if (brand.hidden) return false;
      const matchesSearch = brand.name.toLowerCase().includes(search.toLowerCase());
      const matchesLetter = selectedLetter === "All" || brand.name.startsWith(selectedLetter);
      return matchesSearch && matchesLetter;
    });
  }, [allBrands, search, selectedLetter]);

  // Spotlight removed — no right-side promotional column on Brands page

  return (
    <div className="bg-[#F8F8F8] min-h-screen">
      <SEO title="Brands" description="Discover top pet brands and their products at EZStore." />
      <Navbar />

      <div className="max-w-8xl mx-auto px-8 md:px-16 lg:px-20 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)] gap-8">
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
                              ? "text-[#E53935] font-bold"
                              : "hover:text-[#1F6B52]"
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
                        {getBrandLogoSrc(brand) ? (
                          <img src={getBrandLogoSrc(brand)} alt={brand.name} className="h-8 w-8 object-contain" loading="lazy" />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F3EC] font-semibold text-[#1F6B52]">{brand.name.charAt(0)}</span>
                        )}
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
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Trusted Brands</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
              {filteredBrandList.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brands/${brand.slug}`}
                  className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-transform duration-300 overflow-hidden flex items-center justify-center p-6"
                  aria-label={brand.name}
                >
                  <div className="w-full h-40 flex items-center justify-center bg-white">
                    {getBrandLogoSrc(brand) ? (
                      <img src={getBrandLogoSrc(brand)} alt={brand.name} className="max-h-32 max-w-full object-contain" loading="lazy" />
                    ) : (
                      <span className="text-5xl font-bold text-[#1F6B52]">{brand.name.charAt(0)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BrandsPage;
