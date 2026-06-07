import { useState, useRef, useEffect } from "react";
import MegaMenuSection from "./MegaMenuSection";

import { dogCategories } from "../../data/dogCategories";
import { catCategories } from "../../data/catCategories";

const groupBySection = (categories) => {
  const grouped = categories.reduce((acc, cat) => {
    if (!acc[cat.section]) acc[cat.section] = [];
    acc[cat.section].push(cat);
    return acc;
  }, {});

  return Object.entries(grouped).map(([title, categories]) => ({
    title,
    categories,
  }));
};

const MegaMenu = ({ label = "" }) => {
  const [open, setOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const isDog = String(label ?? '').toLowerCase() === "dogs";
  const isCat = String(label ?? '').toLowerCase() === "cats";
  const categories = isDog ? dogCategories : catCategories;
  const sections = groupBySection(categories);
  const showBanner = false; // hide right-side banner image in the navbar dropdown

  useEffect(() => {
    const header = document.querySelector("header");
    const updateTop = () => {
      if (header) {
        setDropdownTop(header.offsetHeight);
      }
    };

    updateTop();
    window.addEventListener("resize", updateTop);

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        dropdownRef.current &&
        !menuRef.current.contains(event.target) &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", updateTop);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onMouseEnter={() => setOpen(true)}
        className="px-4 py-2 font-semibold text-gray-800 hover:text-primary-600 transition-all"
      >
        {label}
      </button>

      <div
        className={`fixed inset-x-0 z-60 transition-all duration-200 ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ top: dropdownTop }}
        ref={dropdownRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div
          className={`relative bg-white rounded-t-2xl rounded-b-none shadow-2xl py-6 md:py-8 w-full transition-transform ease-out duration-200 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <MegaMenuSection title={label} sections={sections} showBanner={showBanner} onClick={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;