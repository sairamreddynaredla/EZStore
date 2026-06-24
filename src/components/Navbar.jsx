import { useState, useRef, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import NavbarDropdown from "./navbar/NavbarDropdown";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useCart } from "../hooks/usecart";
import logo from "../assets/logo/ezstore-logo-optimized.webp";

function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Remove Home and Pets, Brands handled separately
  const navLinks = [{ to: "/best-sellers", label: "Best Sellers" }];

  // (Category selector removed) 

  // Popular search suggestions
  const popularSearches = [
    "Dog Food",
    "Cat Food",
    "Treats",
    "Toys",
    "Grooming",
    "Supplements",
  ];

  // Debounced query for typeahead
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(search.trim()), 200);
    return () => clearTimeout(id);
  }, [search]);

  const filteredSuggestions = debouncedQuery
    ? popularSearches.filter((s) => s.toLowerCase().includes(debouncedQuery.toLowerCase()))
    : [];

  const suggestions = debouncedQuery ? filteredSuggestions : searchHistory.slice(0, 5);

  // Keyboard nav for suggestions (declared after handleSearch)
  const [activeIndex, setActiveIndex] = useState(-1);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e, term = null) => {
    e?.preventDefault();
    const searchTerm = (term || search).trim();
    if (!searchTerm) {
      return;
    }

    // Add to search history (dedupe case-insensitively, preserve original casing)
    const normalized = searchTerm.toLowerCase();
    const updated = [
      searchTerm,
      ...searchHistory.filter((s) => s.toLowerCase() !== normalized),
    ].slice(0, 10);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));

    navigate(`/pets?search=${encodeURIComponent(searchTerm)}`);
    setSearch("");
    setShowSuggestions(false);
    setMobileMenu(false);
  };

  const onKeyDown = useCallback(
    (e) => {
      if (!showSuggestions) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          e.preventDefault();
          handleSearch(e, suggestions[activeIndex]);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    },
    [showSuggestions, suggestions, activeIndex, handleSearch],
  );

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.focus();
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
    setShowSuggestions(false);
  };

  // Global keyboard shortcut: press '/' to focus the search input
  useEffect(() => {
    const onGlobalKey = (e) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const active = document.activeElement;
        const tag = active?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea" && !active?.isContentEditable) {
          e.preventDefault();
          searchInputRef.current?.focus();
          setShowSuggestions(true);
          setActiveIndex(-1);
        }
      }
    };

    document.addEventListener("keydown", onGlobalKey);
    return () => document.removeEventListener("keydown", onGlobalKey);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 md:px-8 py-3 md:py-4 gap-6">
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
                  `font-medium transition-all duration-300 px-4 py-2.5 rounded-full whitespace-nowrap nav-link ${
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

          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center bg-gradient-to-r from-white to-gray-50 border-2 border-[#E5E7EB] rounded-full px-2 sm:px-4 py-2 sm:py-2.5 gap-2 sm:gap-3 flex-1 max-w-xs sm:max-w-2xl shadow-sm hover:shadow-lg hover:border-[#1F6B52] focus-within:shadow-lg focus-within:border-[#1F6B52] focus-within:from-[#F0F9F7] transition-all duration-300 relative"
          >
            {/* Category selector removed */}

            <FaSearch className="text-[#1F6B52] text-sm flex-shrink-0" />
            <input
              ref={searchInputRef}
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls="search-suggestions"
              aria-autocomplete="list"
              type="text"
              inputMode="search"
              enterKeyHint="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
                setActiveIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={onKeyDown}
              className="bg-transparent text-[#1A1A1A] placeholder-[#8B92A9] text-xs sm:text-sm outline-none w-full font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-[#8B92A9] hover:text-[#1F6B52] flex-shrink-0 transition-colors duration-200"
                aria-label="Clear search"
              >
                <FaTimes className="text-sm" />
              </button>
            )}

            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                id="search-suggestions"
                role="listbox"
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="max-h-72 overflow-y-auto">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      role="option"
                      aria-selected={activeIndex === idx}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(-1)}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSearch(e, suggestion);
                      }}
                      className={`w-full px-5 py-3 text-left hover:bg-[#F0F9F7] text-[#4B5563] hover:text-[#1F6B52] transition-all duration-200 flex items-center gap-2 group border-b border-[#F0F0F0] last:border-b-0 ${
                        activeIndex === idx ? "bg-[#F0F9F7]" : ""
                      }`}
                    >
                      <FaSearch className="text-[#8B92A9] group-hover:text-[#1F6B52] text-xs" />
                      <span className="flex-1 text-sm font-medium">
                        {/** highlight match */}
                        {(() => {
                          const q = debouncedQuery.toLowerCase();
                          const s = suggestion;
                          if (!q) return s;
                          const i = s.toLowerCase().indexOf(q);
                          if (i === -1) return s;
                          return (
                            <>
                              {s.substring(0, i)}
                              <span className="font-semibold text-[#1F6B52]">{s.substring(i, i + q.length)}</span>
                              {s.substring(i + q.length)}
                            </>
                          );
                        })()}
                      </span>
                      {!search.trim() && (
                        <span className="text-[10px] text-[#8B92A9]">Recent</span>
                      )}
                    </button>
                  ))}
                </div>

                {searchHistory.length > 0 && !search.trim() && (
                  <div className="px-5 py-2 bg-gray-50 border-t border-[#E5E7EB] text-center">
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="text-[10px] text-[#8B92A9] hover:text-red-500 font-medium transition-colors duration-200"
                    >
                      Clear History
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="hidden md:flex items-center gap-2 sm:gap-4 md:gap-6 text-[#4B5563] text-lg shrink-0">
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
            className="md:hidden p-2.5 h-12 w-12 flex items-center justify-center text-[#4B5563] hover:bg-[#F5F5F5] rounded-lg transition-all duration-300"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle Menu"
          >
            {mobileMenu ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-[#E5E7EB] px-5 py-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
            <div className="space-y-2">
              {/* Mobile: Dogs and Cats dropdowns as links */}
              <NavLink
                to="/dogs/dry-food"
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `block text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                    isActive
                      ? "text-[#1F6B52] bg-[#E8F5F0]"
                      : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                  }`
                }
              >
                Dogs
              </NavLink>
              <NavLink
                to="/cats/dry-food"
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `block text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                    isActive
                      ? "text-[#1F6B52] bg-[#E8F5F0]"
                      : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                  }`
                }
              >
                Cats
              </NavLink>
              <NavLink
                to="/brands"
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `block text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left ${
                    isActive
                      ? "text-[#1F6B52] bg-[#E8F5F0]"
                      : "text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5]"
                  }`
                }
              >
                Brands
              </NavLink>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `block text-base font-medium transition-all duration-300 px-4 py-3 rounded-lg w-full text-left nav-link ${
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

            <form
              onSubmit={handleSearch}
              className="flex items-center bg-gradient-to-r from-white to-gray-50 border-2 border-[#E5E7EB] rounded-xl px-4 py-3 gap-3 shadow-md focus-within:shadow-lg focus-within:border-[#1F6B52] focus-within:from-[#F0F9F7] transition-all duration-300 relative"
            >
              <FaSearch className="text-[#1F6B52] text-sm" />
              <input
                ref={searchInputRef}
                type="text"
                inputMode="search"
                enterKeyHint="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="bg-transparent text-[#1A1A1A] placeholder-[#8B92A9] text-sm outline-none w-full font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-[#8B92A9] hover:text-[#1F6B52] transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <FaClose className="text-sm" />
                </button>
              )}
            </form>

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
      <div className="h-12 md:h-20 lg:h-24" aria-hidden="true" />
    </>
  );
}

export default Navbar;
