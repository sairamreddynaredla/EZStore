import { products } from "../../data/products"
import ProductGrid from "../../components/products/ProductGrid"
const BestSellers = () => {

  return (
    <section className="bg-[#f7f3ee] min-h-screen py-16">

      <div className="max-w-[1400px] mx-auto px-6">

        {/* TITLE */}
        <div className="mb-10">

          <p className="text-orange-500 uppercase tracking-[3px] font-semibold text-sm">
            Trending Products
          </p>

          <h1 className="text-5xl font-black mt-2">
            Best Sellers
          </h1>

          <p className="text-gray-500 mt-3">
            Explore all bestselling products loved by pet parents.
          </p>

        </div>

        {/* PRODUCTS */}
        <ProductGrid products={products} />

      </div>

    </section>
  )
}

export default BestSellers