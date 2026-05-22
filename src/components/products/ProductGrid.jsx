import ProductCard from "./ProductCard"

const ProductGrid = ({ products }) => {

  return (

    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

      {products.map((product) => (

        <ProductCard
          key={product.id}
          product={product}
        />

      ))}

    </div>

  )
}

export default ProductGrid