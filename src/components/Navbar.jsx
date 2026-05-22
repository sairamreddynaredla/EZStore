import { useState } from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

import useCart from "../hooks/useCart";

function Navbar() {
  const navigate = useNavigate();

  const { totalItems } = useCart();

  const [mobileMenu, setMobileMenu] = useState(false);

  const [search, setSearch] = useState("");

  // TOTAL CART ITEMS
  const totalCartItems = totalItems;

  // HANDLE SEARCH
  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/pets?search=${search.trim()}`);
      setSearch("");
      setMobileMenu(false);
    }
  };

  // NAVBAR LINKS
  const navLinks = [
    { to: "/pets", label: "Pets" },
    { to: "/brands", label: "Brands" },
    { to: "/best-sellers", label: "Best Sellers" },
    { to: "/blogs", label: "Blog" },
  ];

  // ACTIVE NAV STYLE
  const navLinkClass = ({ isActive }) =>
    `font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
      isActive
        ? "text-[#F53B3B] bg-white/10"
        : "text-white hover:text-[#F53B3B] hover:bg-white/5"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0D2B5C]/90 backdrop-blur-md shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4 gap-4">

        {/* LOGO */}
        <NavLink
          to="/"
          className="flex items-center gap-2 shrink-0"
        >
          <img
            src="/src/assets/logo/ezstore-logo.png"
            alt="EZStore Logo"
            className="h-10 md:h-12 object-contain"
          />
        </NavLink>

        {/* DESKTOP NAVBAR */}
        <nav className="hidden md:flex items-center gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navLinkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* DESKTOP SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 gap-2 flex-1 max-w-sm"
        >
          <FaSearch className="text-white/60 text-sm" />

          <input
            type="text"
            placeholder="Search pets, brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white placeholder-white/50 text-sm outline-none w-full"
          />
        </form>

        {/* DESKTOP ICONS */}
        <div className="hidden md:flex items-center gap-5 text-white text-xl shrink-0">

          {/* WISHLIST */}
          <Link
            to="/wishlist"
            className="hover:text-[#F53B3B] transition-all duration-300"
          >
            <FaHeart />
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            className="relative hover:text-[#F53B3B] transition-all duration-300"
          >
            <FaShoppingCart />

            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F53B3B] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalCartItems}
              </span>
            )}
          </Link>

          {/* USER */}
          <Link
            to="/login"
            className="hover:text-[#F53B3B] transition-all duration-300"
          >
            <FaUser />
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle Menu"
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-[#0D2B5C] border-t border-white/10 px-5 py-5 flex flex-col gap-4">

          {/* MOBILE LINKS */}
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenu(false)}
              className={({ isActive }) =>
                `text-lg font-medium transition-all duration-300 px-2 py-2 rounded-lg ${
                  isActive
                    ? "text-[#F53B3B] bg-white/10"
                    : "text-white hover:text-[#F53B3B]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* MOBILE SEARCH */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 gap-2 mt-2"
          >
            <FaSearch className="text-white/60 text-sm" />

            <input
              type="text"
              placeholder="Search pets, brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder-white/50 text-sm outline-none w-full"
            />
          </form>

          {/* MOBILE ICONS */}
          <div className="flex items-center gap-6 text-white text-xl pt-2">

            {/* WISHLIST */}
            <Link
              to="/wishlist"
              onClick={() => setMobileMenu(false)}
              className="hover:text-[#F53B3B] transition-all duration-300"
            >
              <FaHeart />
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              onClick={() => setMobileMenu(false)}
              className="relative hover:text-[#F53B3B] transition-all duration-300"
            >
              <FaShoppingCart />

              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F53B3B] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* USER */}
            <Link
              to="/login"
              onClick={() => setMobileMenu(false)}
              className="hover:text-[#F53B3B] transition-all duration-300"
            >
              <FaUser />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;