import { brands } from "../data/brands";
import { useNavigate } from "react-router-dom";

const BrandsDropdown = () => {
  const navigate = useNavigate();

  // Featured brands
  const popularBrands = brands.filter((b) => b.featured);

  // Import all brand images
  const brandImages = {
    ...import.meta.glob("../assets/brands/*.jpg", {
      eager: true,
      as: "url",
    }),

    ...import.meta.glob("../assets/brands/*.jpeg", {
      eager: true,
      as: "url",
    }),

    ...import.meta.glob("../assets/brands/*.png", {
      eager: true,
      as: "url",
    }),
  };

  // Get image dynamically
  const getBrandImage = (logo) => {
    if (!logo) return "";

    const jpg = `../assets/brands/${logo}.jpg`;
    const jpeg = `../assets/brands/${logo}.jpeg`;
    const png = `../assets/brands/${logo}.png`;

    return (
      brandImages[jpg] ||
      brandImages[jpeg] ||
      brandImages[png] ||
      ""
    );
  };

  // Navigate to brand page
  const handleBrandClick = (brand) => {
    const slug =
      brand.slug ||
      brand.name.toLowerCase().replace(/\s+/g, "-");

    navigate(`/brands/${slug}`);
  };

  return (
    <div
      className="
        absolute
        left-1/2
        top-full
        mt-3
        -translate-x-1/2
        w-[95vw]
        max-w-[1000px]
        bg-white
        shadow-2xl
        rounded-2xl
        z-50
        p-6
        md:p-8
        border
        border-gray-100
        max-h-[85vh]
        overflow-y-auto
      "
    >
      {/* Popular Brands */}
      <div className="mb-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Popular Brands
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {popularBrands.map((brand) => (
            <div
              key={brand.id}
              className="
                flex
                flex-col
                items-center
                cursor-pointer
                hover:scale-105
                transition-all
                duration-300
              "
              onClick={() => handleBrandClick(brand)}
            >
              <div
                className="
                  w-24
                  h-24
                  rounded-2xl
                  border
                  border-gray-100
                  shadow-sm
                  bg-white
                  p-3
                  flex
                  items-center
                  justify-center
                  hover:shadow-md
                "
              >
                <img
                  src={getBrandImage(brand.logo)}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/100?text=Brand";
                  }}
                />
              </div>

              <span className="text-sm font-medium text-center mt-3">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* All Brands */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-8 text-center">
          All Brands
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 w-full">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="
                flex
                flex-col
                items-center
                cursor-pointer
                hover:scale-105
                transition-all
                duration-300
              "
              onClick={() => handleBrandClick(brand)}
            >
              <div
                className="
                  w-16
                  h-16
                  rounded-xl
                  border
                  border-gray-100
                  shadow-sm
                  bg-white
                  p-2
                  flex
                  items-center
                  justify-center
                  hover:shadow-md
                "
              >
                <img
                  src={getBrandImage(brand.logo)}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/80?text=Brand";
                  }}
                />
              </div>

              <span className="text-xs font-medium text-center mt-2">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsDropdown;