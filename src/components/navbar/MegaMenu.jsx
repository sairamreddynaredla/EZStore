import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import MegaMenuSection from "./MegaMenuSection";
import BrandsMegaContent from "./BrandsMegaContent";

import { dogCategories } from "../../data/dogCategories";
import { catCategories } from "../../data/catCategories";
import { brands } from "../../data/brands";

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

const MegaMenu = ({ label = "", isOpen, onOpen, onClose }) => {
  const [open, setOpen] = useState(false);
  const active = typeof isOpen === 'boolean' ? isOpen : open;
  const [dropdownTop, setDropdownTop] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0 });
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const normalized = String(label ?? '').toLowerCase();
  const isDog = normalized === "dogs";
  const isCat = normalized === "cats";
  const isBrand = normalized === "brands" || normalized === "brand";

  // For dogs/cats use their category lists; for brands create a single section
  const categories = isDog ? dogCategories : catCategories;
  const sections = isBrand
    ? [
        {
          title: "Brands",
          categories: brands.map((b) => ({
            name: b.name,
            slug: b.slug || b.logo,
            path: `/brands/${b.slug || b.logo}`,
          })),
        },
      ]
    : groupBySection(categories);

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
        if (typeof onClose === 'function') onClose();
        else setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", updateTop);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // compute portal position so dropdown is not clipped by ancestors
  useEffect(() => {
    const updatePosition = () => {
      try {
        const anchor = menuRef.current;
        const viewportPadding = 16;
        const maxWidth = Math.min(1100, window.innerWidth - viewportPadding * 2);
        if (anchor && typeof anchor.getBoundingClientRect === 'function') {
          const rect = anchor.getBoundingClientRect();
          const left = Math.max(viewportPadding, Math.round(rect.left + rect.width / 2 - maxWidth / 2));
          const top = Math.round(rect.bottom + 8);
          setPosition({ left, top, width: maxWidth });
          return;
        }
        const left = Math.max(viewportPadding, Math.round((window.innerWidth - maxWidth) / 2));
        setPosition({ left, top: 80, width: maxWidth });
      } catch (err) {
        // ignore
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [menuRef, open]);

  return (
    <div
      className="relative"
      ref={menuRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="px-4 py-2 font-semibold text-gray-800 hover:text-primary-600 transition-all"
        onFocus={() => setOpen(true)}
      >
        {label}
      </button>

      {/* Dropdown anchored to the menu button - not full-width backdrop */}
      {active && createPortal(
        <div
          ref={dropdownRef}
          onMouseEnter={() => { if (typeof onOpen === 'function') onOpen(); else setOpen(true); }}
          onMouseLeave={() => { if (typeof onClose === 'function') onClose(); else setOpen(false); }}
          style={{ position: 'fixed', left: position.left, top: position.top, width: position.width }}
          className={`z-50 transition-all duration-150`}
        >
          <div className={`bg-white rounded-2xl shadow-2xl py-4 md:py-6 w-full transition-transform ease-out duration-150 ${open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`}>
            <div className="mx-auto px-4 md:px-6">
              {isBrand ? (
                <BrandsMegaContent onClose={() => { if (typeof onClose === 'function') onClose(); else setOpen(false); }} />
              ) : (
                <MegaMenuSection title={label} sections={sections} showBanner={showBanner} onClick={() => { if (typeof onClose === 'function') onClose(); else setOpen(false); }} />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MegaMenu;