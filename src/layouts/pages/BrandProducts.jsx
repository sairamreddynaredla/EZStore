
import { useParams } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { products } from "../../data/products"
import { brands } from "../../data/brands"
import ProductCard from "../../components/products/ProductCard"

const BrandProducts = () => {
  const { brandSlug } = useParams()

  // Find the brand object that matches the slug
  const brandObj = brands.find(
    (b) => b.logo.toLowerCase() === brandSlug.toLowerCase()
  )
  // If not found, fallback to slugified brand name
  const normalizedBrand = brandObj
    ? brandObj.name
    : brandSlug.replace(/-/g, ' ')

  // Filter products by matching brand name (case-insensitive)
  const filteredProducts = products.filter(
    (product) =>
      product.brand.trim().toLowerCase() === normalizedBrand.trim().toLowerCase()
  )

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <Navbar />


      <div className="max-w-360 mx-auto px-5 md:px-10 py-16">
        <h1 className="text-5xl font-bold text-[#0D2B5C] mb-10 capitalize">
          {brandObj ? brandObj.name : brandSlug.replace(/-/g, " ")}
        </h1>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[20px] p-12 text-center">
            <p className="text-gray-500 text-lg">
              No products found for this brand.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default BrandProducts