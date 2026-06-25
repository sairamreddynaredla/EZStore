import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import NavbarDropdown from "./navbar/NavbarDropdown";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaSearch, FaPaw, FaDog, FaCat, FaTags, FaStore, FaClinicMedical, FaBath, FaMapMarkerAlt, FaBlog, FaInfoCircle, FaFileContract, FaHeadset, FaHeartbeat, FaBone, FaFish } from "react-icons/fa";
import { useCart } from "../hooks/usecart";
import products from "../data/products";
import breedData from "../data/breeds";
import logo from "../assets/logo/ezstore-logo-optimized.webp";

function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const suggestionRef = useRef(null);

  const SEARCH_HISTORY_KEY = "ezstore_search_history";

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Failed to load search history", error);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveSearchHistory = (query) => {
    const normalized = query.trim();
    if (!normalized) return;

    setSearchHistory((prev) => {
      const next = [normalized, ...prev.filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 8);
      try {
        window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
      } catch (error) {
        console.warn("Failed to save search history", error);
      }
      return next;
    });
  };

  const navLinks = [{ to: "/best-sellers", label: "Best Sellers" }];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (query) {
      saveSearchHistory(query);
      navigate(`/pets?search=${encodeURIComponent(query)}`);
      setSearch("");
      setShowSuggestions(false);
      setMobileMenu(false);
    }
  };

  const normalizedQuery = search.trim().toLowerCase();

  const productSuggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    const seen = new Set();

    return products
      .filter((product) => {
        const searchText = [product.name, product.brand, product.category, product.subCategory, product.breed, product.pet]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchText.includes(normalizedQuery);
      })
      .slice(0, 6)
      .map((product) => ({
        type: "product",
        label: product.name,
        subLabel: product.brand,
        path: `/product/${product.id}`,
      }))
      .filter((item) => {
        if (seen.has(item.label.toLowerCase())) return false;
        seen.add(item.label.toLowerCase());
        return true;
      });
  }, [normalizedQuery]);

  const breedSuggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    return breedData
      .filter((breed) =>
        breed.name.toLowerCase().includes(normalizedQuery) ||
        String(breed.category || "").toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 5)
      .map((breed) => ({
        type: "breed",
        label: breed.name,
        subLabel: breed.category ? `${breed.category} breed` : "Breed",
        path: `/breed/${breed.slug}`,
      }));
  }, [normalizedQuery]);

  const recentSuggestions = useMemo(() => {
    if (!normalizedQuery) return searchHistory;
    return searchHistory.filter((item) => item.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery, searchHistory]);

  const brandSuggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    const brands = [];
    const seen = new Set();

    for (const product of products) {
      const brand = String(product.brand || "").trim();
      if (!brand) continue;
      const lower = brand.toLowerCase();
      if (seen.has(lower)) continue;
      if (lower.includes(normalizedQuery)) {
        brands.push({
          type: "brand",
          label: brand,
          subLabel: "Brand",
          path: `/pets?search=${encodeURIComponent(brand)}`,
        });
        seen.add(lower);
      }
      if (brands.length >= 5) break;
    }

    return brands;
  }, [normalizedQuery]);

  const suggestions = useMemo(() => {
    return [
      ...recentSuggestions.map((item) => ({ type: "recent", label: item })),
      ...productSuggestions,
      ...brandSuggestions,
      ...breedSuggestions,
    ];
  }, [recentSuggestions, productSuggestions, brandSuggestions, breedSuggestions]);

  const hasSuggestions = suggestions.length > 0;

  const clearSearch = () => {
    setSearch("");
    setActiveSuggestionIndex(-1);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      window.localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.warn("Failed to clear search history", error);
    }
  };

  const selectSuggestion = (item) => {
    if (item.type === "product" || item.type === "breed") {
      navigate(item.path);
      setSearch("");
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    if (item.type === "recent") {
      setSearch(item.label);
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (!hasSuggestions) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      setShowSuggestions(true);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((prev) => Math.max(prev - 1, 0));
      setShowSuggestions(true);
    }

    if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeSuggestionIndex]);
    }

    if (event.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-[#E5E7EB]">

        {/* Mobile header: hamburger (left), centered logo, cart (right) */}
        <div className="md:hidden flex items-center justify-between px-3 py-2">
          <button
            className="p-2.5 h-10 w-10 flex items-center justify-center text-[#4B5563] hover:bg-[#F5F5F5] rounded-lg transition-all duration-300"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle Menu"
          >
            {mobileMenu ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>

          <NavLink to="/" className="flex items-center justify-center grow">
            <img src={logo} alt="EZStore Logo" className="h-9 object-contain mix-blend-multiply" loading="lazy" />
          </NavLink>

          <Link to="/cart" className="relative p-2.5 rounded-lg hover:bg-[#F5F5F5] transition-all">
            <FaShoppingCart className="text-lg" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#1F6B52] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile search moved below hero to avoid duplication */}

        <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between px-3 md:px-8 py-3 md:py-4 gap-6">
          <NavLink
            to="/"
            className="flex items-center gap-1 shrink-0 group hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src={logo}
              alt="EZStore Logo"
              className="h-10 md:h-12 object-contain mix-blend-multiply"
              loading="lazy"
            />
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            <NavbarDropdown />
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-medium transition-all duration-300 px-4 py-2.5 rounded-full whitespace-nowrap ${
                    isActive
                      ? "text-[#1F6B52] bg-[#E8F5F0]"
                      : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop search (md+) - restored inside header */}
          <div className="relative flex-1 max-w-xs sm:max-w-md">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center bg-white border border-[#E5E7EB] rounded-full px-3 sm:px-5 py-2 sm:py-2.5 gap-2 sm:gap-3 shadow-sm hover:shadow-md hover:border-[#1F6B52] focus-within:shadow-md focus-within:border-[#1F6B52] transition-all duration-300"
              ref={searchInputRef}
            >
              <FaSearch className="text-[#4B5563] text-sm flex-shrink-0" />
              <input
                type="text"
                inputMode="search"
                enterKeyHint="search"
                placeholder="Search for products, brands, breeds..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                  setActiveSuggestionIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
                className="bg-transparent text-[#1A1A1A] placeholder-[#4B5563] text-xs sm:text-sm outline-none w-full"
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-[#6B7280] hover:text-[#111827] transition-colors focus:outline-none"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </form>

            {showSuggestions && hasSuggestions && (
              <div
                ref={suggestionRef}
                className="absolute left-0 right-0 mt-2 rounded-[26px] bg-white border border-slate-200 shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3">
                  {recentSuggestions.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
                        <span>Recent searches</span>
                        <button
                          type="button"
                          onClick={clearSearchHistory}
                          className="text-[#4B5563] hover:text-[#1F6B52] font-semibold"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="grid gap-2">
                        {recentSuggestions.slice(0, 5).map((item) => (
                          <button
                            type="button"
                            key={item}
                            onClick={() => {
                              setSearch(item);
                              setShowSuggestions(true);
                            }}
                            className="text-left text-sm text-slate-700 hover:text-[#1F6B52] hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {productSuggestions.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Products</div>
                      <div className="grid gap-2">
                        {productSuggestions.map((item) => {
                          const index = suggestions.findIndex((suggestion) => suggestion.label === item.label && suggestion.type === item.type);
                          const isActive = activeSuggestionIndex === index;
                          return (
                            <button
                              type="button"
                              key={`${item.type}-${item.label}`}
                              onClick={() => selectSuggestion(item)}
                              className={`text-left rounded-lg px-3 py-2 transition-colors ${isActive ? "bg-slate-100" : "hover:bg-slate-50"}`}
                            >
                              <div className="font-medium text-sm text-slate-900">{item.label}</div>
                              <div className="text-xs text-slate-500">{item.subLabel}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {brandSuggestions.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Brands</div>
                      <div className="grid gap-2">
                        {brandSuggestions.map((item) => {
                          const index = suggestions.findIndex((suggestion) => suggestion.label === item.label && suggestion.type === item.type);
                          const isActive = activeSuggestionIndex === index;
                          return (
                            <button
                              type="button"
                              key={`${item.type}-${item.label}`}
                              onClick={() => selectSuggestion(item)}
                              className={`text-left rounded-lg px-3 py-2 transition-colors ${isActive ? "bg-slate-100" : "hover:bg-slate-50"}`}
                            >
                              <div className="font-medium text-sm text-slate-900">{item.label}</div>
                              <div className="text-xs text-slate-500">{item.subLabel}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {breedSuggestions.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Breeds</div>
                      <div className="grid gap-2 pb-1">
                        {breedSuggestions.map((item) => {
                          const index = suggestions.findIndex((suggestion) => suggestion.label === item.label && suggestion.type === item.type);
                          const isActive = activeSuggestionIndex === index;
                          return (
                            <button
                              type="button"
                              key={`${item.type}-${item.label}`}
                              onClick={() => selectSuggestion(item)}
                              className={`text-left rounded-lg px-3 py-2 transition-colors ${isActive ? "bg-slate-100" : "hover:bg-slate-50"}`}
                            >
                              <div className="font-medium text-sm text-slate-900">{item.label}</div>
                              <div className="text-xs text-slate-500">{item.subLabel}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[#4B5563] text-lg shrink-0">
            <Link
              to="/cart"
              className="relative p-2.5 sm:p-3 rounded-lg hover:bg-[#F5F5F5] hover:text-[#1F6B52] transition-all duration-300 group"
            >
              <FaShoppingCart className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#1F6B52] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/wishlist"
              className="hidden sm:block p-2.5 sm:p-3 rounded-lg hover:bg-[#F5F5F5] hover:text-[#1F6B52] transition-all duration-300 group"
            >
              <FaHeart className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
            </Link>
            <Link
              to="/login"
              className="hidden md:block p-2.5 sm:p-3 rounded-lg hover:bg-[#F5F5F5] hover:text-[#1F6B52] transition-all duration-300 group"
            >
              <FaUser className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
            </Link>
          </div>

          <button
            className="hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle Menu"
          />
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-[#E5E7EB] px-5 py-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
            <div className="space-y-2">
              {/* Mobile: Dogs and Cats dropdowns as links */}
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                      isActive
                        ? "text-[#1F6B52] bg-[#E8F5F0]"
                        : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                    }`
                  }
                >
                  <FaUser className="text-xl text-[#6B7280]" />
                  Login/Register
                </NavLink>
                <NavLink
                  to="/dogs/dry-food"
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                      isActive
                        ? "text-[#1F6B52] bg-[#E8F5F0]"
                        : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                    }`
                  }
                >
                  <FaDog className="text-xl text-[#6B7280]" />
                  Dogs
                </NavLink>
                <NavLink
                  to="/cats/dry-food"
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                      isActive
                        ? "text-[#1F6B52] bg-[#E8F5F0]"
                        : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                    }`
                  }
                >
                  <FaCat className="text-xl text-[#6B7280]" />
                  Cats
                </NavLink>
                <NavLink
                  to="/dogs/dry-food"
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                      isActive
                        ? "text-[#1F6B52] bg-[#E8F5F0]"
                        : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                    }`
                  }
                >
                    <FaBone className="text-xl text-[#6B7280]" />
                  Dry Food
                </NavLink>
                <NavLink
                  to="/cats/wet-food"
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                      isActive
                        ? "text-[#1F6B52] bg-[#E8F5F0]"
                        : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                    }`
                  }
                >
                  <FaFish className="text-xl text-[#6B7280]" />
                  Wet Food
                </NavLink>
                <NavLink
                  to="/brands"
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                      isActive
                        ? "text-[#1F6B52] bg-[#E8F5F0]"
                        : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                    }`
                  }
                >
                  <FaTags className="text-xl text-[#6B7280]" />
                  Brands
                </NavLink>
                <NavLink
                  to="/lifestage"
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                      isActive
                        ? "text-[#1F6B52] bg-[#E8F5F0]"
                        : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                    }`
                  }
                >
                  <FaStore className="text-xl text-[#6B7280]" />
                    Shop By Lifestage
                </NavLink>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenu(false)}
                    className={({ isActive }) =>
                      `block text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                        isActive
                          ? "text-[#1F6B52] bg-[#E8F5F0]"
                          : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
            </div>
              <div className="h-px bg-[#E5E7EB] my-2"></div>

              <div className="flex flex-col gap-1 px-2">
                <NavLink to="/store-locator" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[#4B5563] rounded-lg hover:bg-[#F5F5F5]">
                  <FaMapMarkerAlt className="text-lg" />
                  Store Locator
                </NavLink>
                <NavLink to="/blogs" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[#4B5563] rounded-lg hover:bg-[#F5F5F5]">
                  <FaBlog className="text-lg" />
                  Blogs
                </NavLink>
                <NavLink to="/about" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[#4B5563] rounded-lg hover:bg-[#F5F5F5]">
                  <FaInfoCircle className="text-lg" />
                  About Us
                </NavLink>
                <NavLink to="/policies" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[#4B5563] rounded-lg hover:bg-[#F5F5F5]">
                  <FaFileContract className="text-lg" />
                  Customer Policies
                </NavLink>
                <NavLink to="/support" onClick={() => setMobileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-[#4B5563] rounded-lg hover:bg-[#F5F5F5]">
                  <FaHeadset className="text-lg" />
                  Customer Support
                </NavLink>
              </div>

              <div className="h-px bg-[#E5E7EB] my-2"></div>

              <div className="flex items-center justify-around text-[#4B5563] text-lg pt-3 pb-2">
              <Link
                to="/wishlist"
                onClick={() => setMobileMenu(false)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-[#F5F5F5] hover:text-[#1F6B52] transition-all duration-300 group"
              >
                <FaHeart className="text-xl group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-medium">Wishlist</span>
              </Link>

              <Link
                to="/cart"
                onClick={() => setMobileMenu(false)}
                className="relative flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-[#F5F5F5] hover:text-[#1F6B52] transition-all duration-300 group"
              >
                <FaShoppingCart className="text-xl group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-medium">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-[#1F6B52] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {totalItems}
                  Shop By Lifestage
                  </span>
                )}
              </Link>

              <Link
                to="/login"
                onClick={() => setMobileMenu(false)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-[#F5F5F5] hover:text-[#1F6B52] transition-all duration-300 group"
              >
                <FaUser className="text-xl group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-medium">Account</span>
              </Link>
            </div>
          </div>
        )}
      </header>
      <div className="h-14 md:h-20 lg:h-24" aria-hidden="true" />
    </>
  );
}

export default Navbar;
