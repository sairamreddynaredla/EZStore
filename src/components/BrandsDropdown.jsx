import { brands } from "../data/brands";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Brand images
import royalCanin from "../assets/brands/royal-canin.jpeg";
import pedigree from "../assets/brands/pedigree.jpeg";
import drools from "../assets/brands/drools.jpeg";
import farmina from "../assets/brands/farmina.jpeg";
import whiskas from "../assets/brands/whiskas.jpeg";
import meo from "../assets/brands/meo.jpeg";
import sheba from "../assets/brands/sheba.jpeg";
import purina from "../assets/brands/purina.jpeg";
import orijen from "../assets/brands/orijen.jpeg";
import tasteWild from "../assets/brands/taste-of-the-wild.jpeg";
import jerhigh from "../assets/brands/jerhigh.jpeg";
import himalaya from "../assets/brands/himalaya.jpeg";

import goodies from "../assets/brands/goodies.jpeg";
import smartheart from "../assets/brands/smartheart.jpeg";
import acana from "../assets/brands/acana.jpeg";
import kennelKitchen from "../assets/brands/kennel-kitchen.jpeg";

import banners from '../assets/brand-banners'

const BrandsDropdown = ({ onBrandSelect, anchorRef }) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0 });

  // Featured brands
  const popularBrands = brands.filter((b) => b.featured);

  // ALL brand images mapping
  const brandImages = {
    "royal-canin": royalCanin,
    pedigree: pedigree,
    drools: drools,
    farmina: farmina,
    whiskas: whiskas,
    meo: meo,
    sheba: sheba,
    purina: purina,
    orijen: orijen,
    "taste-of-the-wild": tasteWild,
    jerhigh: jerhigh,
    himalaya: himalaya,
    goodies: goodies,
    smartheart: smartheart,
    acana: acana,
    "kennel-kitchen": kennelKitchen,
  };

  // Get image
  const getBrandImage = (logo) => {
    if (!logo) return ""
    return brandImages[logo] || banners[logo] || banners[String(logo).replace(/-/g, '')] || "";
  };

  // Navigate to brand page
  const handleBrandClick = (brand) => {
    const slug =
      brand.slug ||
      String(brand.name ?? '').toLowerCase().replace(/\s+/g, "-");

    navigate(`/brands/${slug}`);
    if (typeof onBrandSelect === "function") {
      onBrandSelect();
    }
  };

  useEffect(() => {
    const updatePosition = () => {
      try {
        const anchor = anchorRef && anchorRef.current;
        const viewportPadding = 16;
        const maxWidth = Math.min(1100, window.innerWidth - viewportPadding * 2);
        if (anchor && typeof anchor.getBoundingClientRect === 'function') {
          const rect = anchor.getBoundingClientRect();
          const left = Math.max(viewportPadding, Math.round(rect.left + rect.width / 2 - maxWidth / 2));
          const top = Math.round(rect.bottom + 8 + window.scrollY);
          setPosition({ left, top, width: maxWidth });
          return;
        }
        // fallback: center
        const left = Math.max(viewportPadding, Math.round((window.innerWidth - maxWidth) / 2));
        setPosition({ left, top: 80 + window.scrollY, width: maxWidth });
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
  }, [anchorRef]);

  return (
    <div
      className={
        `fixed z-50 bg-white shadow-2xl rounded-2xl p-4 md:p-6 border border-gray-100 max-h-[70vh] overflow-y-auto`
      }
      style={{ left: position.left, top: position.top, width: position.width }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold mb-2">Popular Brands</h2>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Discover the top pet brands. Tap any brand to view products and offers.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        {popularBrands.map((brand) => (
          <button
            key={brand.id}
            type="button"
            onClick={() => handleBrandClick(brand)}
            className="
              group
              flex
              flex-col
              items-center
              justify-between
              rounded-[2rem]
              border
              border-gray-200
              bg-white
              p-4
              text-center
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <div className="flex h-24 w-full items-center justify-center rounded-3xl bg-gray-50 p-3">
              <img
                src={getBrandImage(brand.logo)}
                alt={brand.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/placeholder-product.svg';
                }}
              />
            </div>
            <span className="mt-4 text-sm font-semibold text-slate-900">
              {brand.name}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => navigate('/brands')}
          className="inline-flex items-center rounded-full bg-[#1F6B52] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184f42]"
        >
          View brands
        </button>
      </div>
    </div>
  );
};

export default BrandsDropdown;