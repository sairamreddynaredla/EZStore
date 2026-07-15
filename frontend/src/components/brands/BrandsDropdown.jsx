import { Link } from "react-router-dom";
import { brands } from "../../data/brands";

const BrandsDropdown = ({ onClick }) => (
  <div className="relative group">
    <button className="px-4 py-2 font-semibold text-gray-800 hover:text-primary-600 focus:outline-none">
      Brands
    </button>
    <div className="absolute left-0 top-full z-30 w-56 bg-white shadow-2xl rounded-xl mt-2 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 ease-in-out">
      <ul className="p-4 space-y-2">
        {brands.map((brand) => (
          <li key={brand.slug}>
            <Link
              to={`/brands/${brand.slug}`}
              className="block px-2 py-1 rounded hover:bg-primary-50 hover:text-primary-700 transition"
              onClick={onClick}
            >
              {brand.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default BrandsDropdown;
