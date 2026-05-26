import { Link } from 'react-router-dom'
import { FaHeart, FaStar } from 'react-icons/fa'
import AddToCartButton from '../../components/products/AddToCartButton'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { brands } from '../../data/brands'
import { products } from '../../data/products'
import useCart from '../../hooks/usecart'
import { useWishlist } from '../../context/WishListContext'

// Import all brand logos
import royalCaninLogo from '../../assets/brands/royal-canin.jpeg'
import purinaLogo from '../../assets/brands/purina.jpeg'
import farminaLogo from '../../assets/brands/farmina.jpeg'
import origenLogo from '../../assets/brands/orijen.jpeg'
import droolsLogo from '../../assets/brands/drools.jpeg'
import meoLogo from '../../assets/brands/meo.jpeg'
import kennelKitchenLogo from '../../assets/brands/kennel-kitchen.jpeg'
import whiskasLogo from '../../assets/brands/whiskas.jpeg'
import shebaLogo from '../../assets/brands/sheba.jpeg'
import tasteWildLogo from '../../assets/brands/taste-of-the-wild.jpeg'

// Map brand logo keys to imported images
const logoMap = {
  'royal-canin': royalCaninLogo,
  purina: purinaLogo,
  farmina: farminaLogo,
  orijen: origenLogo,
  drools: droolsLogo,
  meo: meoLogo,
  'kennel-kitchen': kennelKitchenLogo,
  whiskas: whiskasLogo,
  sheba: shebaLogo,
  'taste-of-the-wild': tasteWildLogo,
}

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)

  const activeVariant = product?.variants?.[0]
  const discountPercentage = Math.round(
    ((activeVariant?.originalPrice - activeVariant?.price) / activeVariant?.originalPrice) * 100
  )

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 h-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercentage}%
            </div>
          )}
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              if (isWishlisted) {
                removeFromWishlist(product.id)
              } else {
                addToWishlist(product)
              }
            }}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            <FaHeart size={16} className={isWishlisted ? 'text-red-500' : 'text-gray-400'} />
          </button>
        </div>
        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Brand */}
          <p className="text-xs font-semibold text-orange-500 mb-1">{product.brand}</p>
          {/* Name */}
          <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <FaStar className="text-yellow-400" size={12} />
            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
          {/* Price */}
          <div className="flex items-center gap-2 mb-4 mt-auto">
            <span className="text-lg font-bold text-green-600">${activeVariant?.price}</span>
            {activeVariant?.originalPrice > activeVariant?.price && (
              <span className="text-sm text-gray-400 line-through">${activeVariant?.originalPrice}</span>
            )}
          </div>
          {/* Add to Cart Button */}
          <AddToCartButton
            product={{ ...product, selectedVariant: activeVariant }}
            isOutOfStock={product.stock <= 0}
            onAddToCart={(prod, quantity) =>
              addToCart({
                ...prod,
                quantity,
              })
            }
            quantity={1}
          />
        </div>
      </div>
    </Link>
  )
}

const BrandsPage = () => {
  const featuredBrands = brands.filter(b => b.featured)
  // Get products for each featured brand
  const getBrandProducts = (brandName) => {
    return products.filter(p => p.brand.toLowerCase() === brandName.toLowerCase()).slice(0, 4)
  }
  return (
    <div className='bg-[#f8f8f8] min-h-screen'>
      {/* NAVBAR */}
      <Navbar />
      {/* PAGE CONTENT */}
      <div className='max-w-360 mx-auto px-5 md:px-10 py-16'>
        {/* HEADER */}
        <div className='mb-20'>
          <h1 className='text-5xl md:text-6xl font-bold text-[#0D2B5C] mb-4'>
            Our Premium Pet Brands
          </h1>
          <p className='text-gray-600 text-lg max-w-2xl'>
            Discover our curated selection of trusted and premium pet food brands with their exclusive products.
          </p>
        </div>
        {/* FEATURED BRANDS WITH PRODUCTS */}
        {featuredBrands.map((brand) => {
          const brandProducts = getBrandProducts(brand.name)
          const logoSrc = logoMap[brand.logo]
          return (
            <div key={brand.id} className='mb-24'>
              {/* Brand Header */}
              <div className='bg-white rounded-[20px] p-8 mb-10 shadow-sm'>
                <div className='flex items-center gap-6 mb-6'>
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={brand.name}
                      className='h-20 max-w-37.5 object-contain'
                    />
                  ) : (
                    <div>
                      <h2 className='text-3xl font-bold text-[#0D2B5C]'>{brand.name}</h2>
                    </div>
                  )}
                </div>
                <p className='text-gray-600 mb-6'>
                  Browse our collection of {brand.name} products for your beloved pets.
                </p>
                <Link
                  to={`/brands/${brand.logo}`}
                  className='inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300'
                >
                  View All {brand.name} Products
                </Link>
              </div>
              {/* Products Grid */}
              {brandProducts.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                  {brandProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className='bg-white rounded-[20px] p-12 text-center'>
                  <p className='text-gray-500 text-lg'>No products available for this brand yet.</p>
                </div>
              )}
            </div>
          )
        })}
        {/* CTA SECTION */}
        <div className='mt-20 bg-linear-to-r from-orange-500 to-orange-600 rounded-[20px] p-12 text-center'>
          <h3 className='text-3xl font-bold text-white mb-4'>
            Explore More Pet Products
          </h3>
          <p className='text-orange-100 text-lg mb-8 max-w-2xl mx-auto'>
            Browse our complete pet food shop with thousands of products from all brands.
          </p>
          <Link
            to='/shop'
            className='inline-block bg-white text-orange-600 hover:bg-orange-50 font-bold px-10 py-4 rounded-full transition-all duration-300 hover:shadow-lg'
          >
            Explore All Products
          </Link>
        </div>
      </div>
      {/* FOOTER */}
      <Footer />
    </div>
  )
}

export default BrandsPage
