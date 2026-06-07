import Navbar from '../../components/Navbar'
import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { products } from "../../data/products";


import ProductGallery from '../../components/productdetails/ProductGallery'
import ProductInfo from '../../components/productdetails/ProductInfo'
import BuyBox from '../../components/productdetails/BuyBox'
import DeliveryBox from '../../components/productdetails/DeliveryBox'
import SimilarProducts from '../../components/productdetails/SimilarProducts'
import useCart from '../../hooks/usecart'
import { useWishlist } from '../../context/usewishlist'

const ProductDetails = () => {

  const navigate = useNavigate();

  const { id } = useParams()
  const location = useLocation()

  const [openSection, setOpenSection] = useState('details')

  const toggleSection = (section) => {
    setOpenSection(
      openSection === section
        ? null
        : section
    )
  }

  // FIND PRODUCT — prefer router state when navigating from a product list to
  // avoid accidental collisions when product IDs are duplicated across
  // different sections of the data file. Fall back to lookup by `id` so
  // direct URLs still work.
  const productFromState = location?.state?.product
  const product = productFromState ?? products.find(
    (item) => item.id === Number(id)
  )

  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || {})
  const [quantity, setQuantity] = useState(1)

  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist } = useWishlist()

  const formatCategoryLabel = (category) => {
    if (!category) return 'Unknown';
    return category
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const productCategoryLabel = product?.productCategory || formatCategoryLabel(product?.category);

  const handleAddToCart = async (productId, quantity = 1) => {
    const productToAdd = products.find((item) => item.id === Number(productId))
    if (productToAdd) {
      addToCart({ ...productToAdd, quantity })
    }
  }

  // BUY NOW HANDLER
  const handleBuyNow = async () => {
    await handleAddToCart(product.id, 1);
    navigate('/checkout');
  }

  const handleWishlistToggle = (productId, isAdding) => {
    const productToUpdate = products.find((item) => item.id === Number(productId))
    if (!productToUpdate) return

    if (isAdding) {
      addToWishlist(productToUpdate)
    } else {
      removeFromWishlist(productId)
    }
  }

  // PRODUCT NOT FOUND
  if (!product) {

    return (

      <div className="min-h-screen bg-[#f8f8f8]">

        <Navbar />

        <div className="flex items-center justify-center h-[70vh]">

          <h1 className="text-4xl font-bold text-gray-700">
            Product Not Found
          </h1>

        </div>

      </div>

    )
  }

  // SIMILAR PRODUCTS
  const similarProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 6)

  return (

    <div className="bg-[#f8f8f8] min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE */}
      <div className="max-w-362.5 mx-auto px-4 md:px-8 py-10">

        {/* BREADCRUMB */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-8">

          <span>Home</span>

          <span>&gt;</span>

          <span>Products</span>

          <span>&gt;</span>

          <span className="capitalize">
            {productCategoryLabel}
          </span>

          <span>&gt;</span>

          <span className="text-black font-medium">
            {product.name}
          </span>

        </div>

        {/* PRODUCT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_0.75fr] gap-14 bg-white rounded-[40px] p-6 md:p-10 shadow-sm border border-gray-100">

          {/* LEFT */}
          <div>
            <ProductGallery key={product.id} product={product} />
            <div className="mt-8">
              <DeliveryBox />
            </div>
          </div>

          {/* CENTER */}
          <div className="flex flex-col">
            <ProductInfo
              product={product}
              handleBuyNow={handleBuyNow}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-28 self-start">
            <BuyBox
              product={product}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              quantity={quantity}
              setQuantity={setQuantity}
              addToCart={addToCart}
              handleBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* JSON-LD structured data for product (helps search engines) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.images || product.image || [],
            "description": product.description,
            "sku": product.sku || String(product.id),
            "brand": { "@type": "Brand", "name": product.brand },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": (product.variants?.[0]?.price || product.price) || "0",
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating || 0,
              "reviewCount": product.reviews || 0
            }
          })}
        </script>

        {/* ACCORDION */}
        <div className="mt-10 bg-white rounded-[35px] overflow-hidden border border-gray-200 shadow-sm">

          {/* DETAILS */}
          <div className="border-b border-gray-200">

            <button
              onClick={() => toggleSection('details')}
              className="w-full flex items-center justify-between px-8 py-6"
            >

              <span className="text-lg md:text-xl font-bold">
                Product Details
              </span>

              <span className="text-3xl font-light">
                {openSection === 'details'
                  ? '−'
                  : '+'}
              </span>

            </button>

            {openSection === 'details' && (

              <div className="px-8 pb-8 text-gray-600 leading-8 text-[15px]">

                <p>

                  {product.description ||

                    'Premium quality pet nutrition product specially designed for healthy growth, strong immunity, and daily wellness support for your pets.'}

                </p>

              </div>

            )}

          </div>

          {/* INGREDIENTS */}
          <div className="border-b border-gray-200">

            <button
              onClick={() => toggleSection('ingredients')}
              className="w-full flex items-center justify-between px-8 py-6"
            >

              <span className="text-lg md:text-xl font-bold">
                Ingredients
              </span>

              <span className="text-3xl font-light">
                {openSection === 'ingredients'
                  ? '−'
                  : '+'}
              </span>

            </button>

            {openSection === 'ingredients' && (

              <div className="px-8 pb-8">

                <ul className="space-y-4">

                  {product.ingredients?.map((item, index) => (

                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-700"
                    >

                      <span className="text-green-600 text-lg">
                        ✔
                      </span>

                      {item}

                    </li>

                  ))}

                </ul>

              </div>

            )}

          </div>

          {/* FEATURES */}
          <div className="border-b border-gray-200">

            <button
              onClick={() => toggleSection('features')}
              className="w-full flex items-center justify-between px-8 py-6"
            >

              <span className="text-lg md:text-xl font-bold">
                Key Features
              </span>

              <span className="text-3xl font-light">
                {openSection === 'features'
                  ? '−'
                  : '+'}
              </span>

            </button>

            {openSection === 'features' && (

              <div className="px-8 pb-8 text-gray-700">

                <ul className="space-y-4 list-disc pl-5">

                  <li>High Protein Formula</li>
                  <li>Supports Healthy Digestion</li>
                  <li>Rich in Vitamins & Minerals</li>
                  <li>Premium Quality Ingredients</li>
                  <li>Suitable For Daily Feeding</li>

                </ul>

              </div>

            )}

          </div>

          {/* MORE INFO */}
          <div>

            <button
              onClick={() => toggleSection('more')}
              className="w-full flex items-center justify-between px-8 py-6"
            >

              <span className="text-lg md:text-xl font-bold">
                More Information
              </span>

              <span className="text-3xl font-light">
                {openSection === 'more'
                  ? '−'
                  : '+'}
              </span>

            </button>

            {openSection === 'more' && (

              <div className="px-8 pb-8 text-gray-700">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="rounded-3xl bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900">Brand:</span>
                      <span className="text-sm text-slate-600 text-right">{product.brand}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900">Pet Type:</span>
                      <span className="text-sm text-slate-600 text-right">{product.pet || 'Dog'}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900">Life Stage:</span>
                      <span className="text-sm text-slate-600 text-right">{product.lifeStage || 'Adult'}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900">Category:</span>
                      <span className="text-sm text-slate-600 text-right wrap-break-word">{productCategoryLabel}</span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900">Flavor:</span>
                      <span className="text-sm text-slate-600 text-right">{product.flavor || 'Chicken'}</span>
                    </div>
                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

        {/* RELATED PRODUCTS */}
        {similarProducts.length > 0 && (

          <div className="mt-16">

            <div className="mb-8">

              <p className="text-orange-500 uppercase tracking-[3px] text-sm font-semibold">
                Recommended Products
              </p>

              <h2 className="text-4xl font-black mt-2">
                You May Also Like
              </h2>

            </div>

            <SimilarProducts
              products={similarProducts}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
            />

          </div>

        )}


      </div>

    </div>

  )
}

export default ProductDetails