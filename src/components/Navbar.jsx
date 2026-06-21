import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import NavbarDropdown from "./navbar/NavbarDropdown";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaSearch, FaPaw, FaDog, FaCat, FaTags, FaStore, FaClinicMedical, FaBath, FaMapMarkerAlt, FaBlog, FaInfoCircle, FaFileContract, FaHeadset, FaHeartbeat, FaBone, FaFish } from "react-icons/fa";
import { useCart } from "../hooks/usecart";
import logo from "../assets/logo/ezstore-logo-optimized.webp";

function Navbar() {
  const navigate = useNavigate();
  const { totalItems, flash, hideFlash } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  

  // Remove Home and Pets, Brands handled separately
  const navLinks = [{ to: "/best-sellers", label: "Best Sellers" }];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/pets?search=${search.trim()}`);
      setSearch("");
      setMobileMenu(false);
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
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-white border border-[#E5E7EB] rounded-full px-3 sm:px-5 py-2 sm:py-2.5 gap-2 sm:gap-3 flex-1 max-w-xs sm:max-w-md shadow-sm hover:shadow-md hover:border-[#1F6B52] focus-within:shadow-md focus-within:border-[#1F6B52] transition-all duration-300"
          >
            <FaSearch className="text-[#4B5563] text-sm flex-shrink-0" />
            <input
              type="text"
              inputMode="search"
              enterKeyHint="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[#1A1A1A] placeholder-[#4B5563] text-xs sm:text-sm outline-none w-full"
            />
          </form>

          

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
      {flash?.visible && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-3 py-2 text-xs font-medium shadow-lg text-white ${flash.type === "success" ? "bg-emerald-600" : "bg-red-600"} rounded-md`}
        >
          <span className="leading-4">{flash.message}</span>
          <button
            onClick={() => hideFlash && hideFlash()}
            aria-label="Close"
            className="ml-1 text-white/80 hover:text-white text-sm leading-4"
          >
            ×
          </button>
        </div>
      )}
      <div className="h-14 md:h-20 lg:h-24" aria-hidden="true" />
    </>
  );
}

export default Navbar;
