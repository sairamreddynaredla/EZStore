import { useState } from "react";
import MegaMenu from "./MegaMenu";
import BrandsDropdown from "../BrandsDropdown";

const NavbarDropdown = () => {
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [brandsPinned, setBrandsPinned] = useState(false);

  const handleBrandsButtonClick = () => {
    setBrandsOpen((open) => {
      const nextOpen = !open;
      setBrandsPinned(nextOpen);
      return nextOpen;
    });
  };

  const handleBrandsMouseEnter = () => {
    if (!brandsPinned) {
      setBrandsOpen(true);
    }
  };

  const handleBrandsMouseLeave = () => {
    if (!brandsPinned) {
      setBrandsOpen(false);
    }
  };

  const handleBrandSelect = () => {
    setBrandsOpen(false);
    setBrandsPinned(false);
  };

  return (
    <div className="hidden lg:flex items-center gap-2">
      <MegaMenu label="Dogs" />
      <MegaMenu label="Cats" />
      <div
        className="relative"
        onMouseEnter={handleBrandsMouseEnter}
        onMouseLeave={handleBrandsMouseLeave}
      >
        <button
          type="button"
          onClick={handleBrandsButtonClick}
          className="px-4 py-2 font-semibold text-gray-800 hover:text-primary-600 transition-all"
          aria-expanded={brandsOpen}
        >
          Brands
        </button>
        {brandsOpen && <BrandsDropdown onBrandSelect={handleBrandSelect} />}
      </div>
    </div>
  );
};

export default NavbarDropdown;