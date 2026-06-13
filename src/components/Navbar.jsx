import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import NavbarDropdown from "./navbar/NavbarDropdown";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { useCart } from "../hooks/usecart";
import logo from "../assets/logo/ezstore-logo-optimized.png";

function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  // Remove Home and Pets, Brands handled separately
  const navLinks = [
    { to: "/best-sellers", label: "Best Sellers" },
  ];

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
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 md:py-4 gap-6">
          <NavLink to="/" className="flex items-center gap-1 shrink-0 group hover:opacity-80 transition-opacity duration-300">
            <img src={logo} alt="EZStore Logo" className="h-10 md:h-12 object-contain mix-blend-multiply" loading="lazy" />
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

          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center bg-white border border-[#E5E7EB] rounded-full px-5 py-2.5 gap-3 flex-1 max-w-md shadow-sm hover:shadow-md hover:border-[#1F6B52] focus-within:shadow-md focus-within:border-[#1F6B52] transition-all duration-300"
          >
            <FaSearch className="text-[#4B5563] text-sm" />
            <input
              type="text"
              placeholder="Search pets, brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[#1A1A1A] placeholder-[#4B5563] text-sm outline-none w-full"
            />
          </form>

          <div className="hidden md:flex items-center gap-6 text-[#4B5563] text-lg shrink-0">
            <Link to="/wishlist" className="p-2 rounded-lg hover:bg-[#F5F5F5] hover:text-[#1F6B52] transition-all duration-300 group">
              <FaHeart className="group-hover:scale-110 transition-transform duration-300" />
            </Link>
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-[#F5F5F5] hover:text-[#1F6B52] transition-all duration-300 group">
              <FaShoppingCart className="group-hover:scale-110 transition-transform duration-300" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#1F6B52] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to="/login" className="p-2 rounded-lg hover:bg-[#F5F5F5] hover:text-[#1F6B52] transition-all duration-300 group">
              <FaUser className="group-hover:scale-110 transition-transform duration-300" />
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-[#4B5563] hover:bg-[#F5F5F5] rounded-lg transition-all duration-300"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle Menu"
          >
            {mobileMenu ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
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

            <form onSubmit={handleSearch} className="flex items-center bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 gap-3 shadow-sm">
              <FaSearch className="text-[#4B5563] text-sm" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[#1A1A1A] placeholder-[#4B5563] text-sm outline-none w-full"
              />
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
      <div className="h-20 md:h-17" aria-hidden="true" />
    </>
  );
}

export default Navbar;