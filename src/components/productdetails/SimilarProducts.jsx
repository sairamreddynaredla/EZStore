import ProductCard from "../products/ProductCard";

const SimilarProducts = ({ products, onAddToCart, onWishlistToggle }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 hide-scrollbar">
      {products.map((product) => (
        <div key={product.id} className="min-w-[200px] w-[200px] flex-shrink-0 sm:w-auto sm:min-w-0">
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onWishlistToggle={onWishlistToggle}
          />
        </div>
      ))}
    </div>
  );
};

export default SimilarProducts;
