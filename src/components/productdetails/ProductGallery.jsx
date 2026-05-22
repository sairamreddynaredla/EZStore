import { useState } from "react"

const ProductGallery = ({ product }) => {
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const [activeIndex, setActiveIndex] = useState(0);

  const mainImage = images[activeIndex] || product.image;

  return (
    <div className="w-full">

      <div className="bg-white border rounded-3xl p-8 shadow-sm">

        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-[500px] object-contain transition-all duration-300"
        />

      </div>

      <div className="flex gap-4 mt-5 flex-wrap">

        {images.map((img, index) => (

          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`
              w-24 h-24 border-2 rounded-2xl p-2 cursor-pointer
              transition-all duration-200 overflow-hidden bg-white focus:outline-none

              ${activeIndex === index
                ? "border-orange-500 ring-2 ring-orange-500/20 scale-105 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
              }
            `}
            aria-label={`View product image ${index + 1}`}
          >

            <img
              src={img}
              alt={`thumbnail ${index + 1}`}
              className="w-full h-full object-contain"
            />

          </button>

        ))}

      </div>

      <div className="mt-6 border rounded-2xl p-5 bg-white hidden">
      </div>

    </div>
  )
}

export default ProductGallery