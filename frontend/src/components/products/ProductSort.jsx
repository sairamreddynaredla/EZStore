const ProductSort = ({ sort, onSort }) => {
  return (
    <select
      value={sort}
      onChange={(e) => onSort(e.target.value)}
      className="px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-orange-500 transition-all bg-white cursor-pointer"
    >
      <option value="featured">Featured</option>
      <option value="priceLow">Price: Low to High</option>
      <option value="priceHigh">Price: High to Low</option>
      <option value="new">Newest</option>
    </select>
  );
};

export default ProductSort;
