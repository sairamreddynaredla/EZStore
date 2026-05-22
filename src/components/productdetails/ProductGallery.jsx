import { useState } from "react"

const ProductGallery = ({ product }) => {

  const [mainImage, setMainImage] = useState(
    product.images?.[0] || product.image
  )

  return (
    <div className="w-full">

      <div className="bg-white border rounded-3xl p-8">

        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-[500px] object-contain"
        />

      </div>

      <div className="flex gap-4 mt-5 flex-wrap">

        {product.images?.map((img, index) => (

          <div
            key={index}
            onClick={() => setMainImage(img)}
            className={`
              w-24 h-24 border rounded-2xl p-2 cursor-pointer
              transition-all overflow-hidden bg-white

              ${mainImage === img
                ? "border-black"
                : "border-gray-200 hover:border-gray-400"
              }
            `}
          >

            <img
              src={img}
              alt="thumbnail"
              className="w-full h-full object-contain"
            />

          </div>

        ))}

      </div>

      <div className="mt-6 border rounded-2xl p-5 bg-white">
      </div>

    </div>
  )
}

export default ProductGallery