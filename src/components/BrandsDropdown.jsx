import { brands } from "../data/brands";
import { useNavigate } from "react-router-dom";

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

const BrandsDropdown = ({ onBrandSelect }) => {
  const navigate = useNavigate();

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
    return brandImages[logo] || "";
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

  return (
    <div
      className="
        fixed
        left-1/2
        top-20
        mt-3
        -translate-x-1/2
        w-[95vw]
        max-w-[1100px]
        bg-white
        shadow-2xl
        rounded-2xl
        z-[60]
        p-6
        md:p-8
        border
        border-gray-100
        max-h-[85vh]
        overflow-y-auto
      "
      role="dialog"
      aria-modal="true"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Popular Brands</h2>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Discover the top pet brands in a clean, card-style layout. Tap any brand to view products and offers.
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
          View All Brands
        </button>
      </div>
    </div>
  );
};

export default BrandsDropdown;