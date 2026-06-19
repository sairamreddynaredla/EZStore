import { IoSearch } from "react-icons/io5";

const ProductSearch = ({ value, onChange }) => {
  return (
    <div className="relative w-full md:w-64">
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={onChange}
        className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-orange-500 transition-all"
      />
      <IoSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
    </div>
  );
};

export default ProductSearch;
