import { brands } from "../data/brands";
import { useNavigate } from "react-router-dom";

export default function BrandSidebar({ selectedBrand, onClose }) {
  const navigate = useNavigate();
  const handleClick = (logo) => {
    navigate(`/brands/${logo}`);
    if (typeof onClose === "function") onClose();
  };

  return (
    <aside className="w-60 p-4 border-r bg-white min-h-screen">
      <h3 className="font-bold mb-4 text-lg">Brands</h3>
      <ul className="space-y-1">
        {brands.map((brand) => (
          <li key={brand.logo}>
            <button
              className={`block w-full text-left px-2 py-1 rounded transition-colors duration-200 ${selectedBrand === brand.logo ? "bg-green-100 font-bold" : "hover:bg-gray-100"}`}
              onClick={() => handleClick(brand.logo)}
            >
              {brand.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
