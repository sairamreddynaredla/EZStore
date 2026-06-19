import ProductCard from "../products/ProductCard";

const SimilarProducts = ({ products, onAddToCart, onWishlistToggle }) => {
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
};

export default SimilarProducts;
