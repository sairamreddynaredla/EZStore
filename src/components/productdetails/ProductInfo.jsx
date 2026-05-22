import { useState } from "react";
import useCart from "../../hooks/usecart";

const ProductInfo = ({ product }) => {

  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || {}
  );

  const [quantity, setQuantity] = useState(1);

  const discountPercentage =
    selectedVariant?.originalPrice
      ? Math.round(
          (
            (selectedVariant.originalPrice - selectedVariant.price) /
            selectedVariant.originalPrice
          ) * 100
        )
      : 0;

  return (

    <div className="space-y-7">

      {/* Brand */}

      <p className="text-sm uppercase tracking-[2px] text-gray-500 font-medium">
        {product.brand}
      </p>

      {/* Product Title */}

      <h1 className="text-4xl font-bold leading-tight text-gray-900">
        {product.name}
      </h1>

      {/* Ratings */}

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-1">

          <span className="text-yellow-500 text-xl">
            ★
          </span>

          <span className="font-semibold text-lg text-gray-900">
            {product.rating}
          </span>

        </div>

        <p className="text-gray-500 text-sm">
          ({product.reviews} Customer Reviews)
        </p>

      </div>

      {/* Pricing */}

      <div className="flex items-center gap-4 flex-wrap">

        <h2 className="text-4xl font-bold text-green-600">
          ${selectedVariant?.price || product.price}
        </h2>

        <span className="text-2xl text-gray-400 line-through">
          ${selectedVariant?.originalPrice || product.oldPrice}
        </span>

        {discountPercentage > 0 && (

          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
            {discountPercentage}% OFF
          </span>

        )}

      </div>

      {/* Variant Selector */}

      {product?.variants?.length > 0 && (

        <div className="space-y-4">

          <h3 className="text-lg font-semibold text-gray-900">
            Select Size
          </h3>

          <div className="flex flex-wrap gap-4">

            {product.variants.map((variant, index) => (

              <button
                key={index}
                onClick={() => setSelectedVariant(variant)}
                className={`
                  px-6 py-3 rounded-xl border font-semibold transition-all
                  ${
                    selectedVariant.weight === variant.weight
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }
                `}
              >

                {variant.weight}

              </button>

            ))}

          </div>

        </div>

      )}

      {/* Quantity Selector */}

      <div className="space-y-4">

        <h3 className="text-lg font-semibold text-gray-900">
          Quantity
        </h3>

        <div className="flex items-center border w-fit rounded-xl overflow-hidden">

          <button
            onClick={() =>
              quantity > 1 &&
              setQuantity(quantity - 1)
            }
            className="px-5 py-3 text-xl hover:bg-gray-100"
          >
            -
          </button>

          <span className="px-6 font-semibold">
            {quantity}
          </span>

          <button
            onClick={() =>
              setQuantity(quantity + 1)
            }
            className="px-5 py-3 text-xl hover:bg-gray-100"
          >
            +
          </button>

        </div>

      </div>

      {/* Stock Status */}

      <div className="flex items-center gap-3 flex-wrap">

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          In Stock
        </span>

        <span className="text-gray-500 text-sm">
          {product.stock} Units Available
        </span>

      </div>

      {/* Description */}

      <p className="text-gray-600 leading-8 text-[16px]">
        {product.description}
      </p>

      {/* Features */}

      <div className="space-y-4">

        <h3 className="text-lg font-semibold text-gray-900">
          Key Benefits
        </h3>

        <ul className="space-y-3">

          {product.features?.map((featureItem, featureIndex) => (

            <li
              key={featureIndex}
              className="flex items-start gap-3 text-gray-700"
            >

              <span className="text-green-600 mt-1">
                ✔
              </span>

              <span>
                {featureItem}
              </span>

            </li>

          ))}

        </ul>

      </div>

      {/* Action Buttons */}

      <div className="flex gap-4 pt-4 flex-wrap">

        <button
          onClick={() =>
            addToCart({
              ...product,
              selectedVariant,
              quantity,
            })
          }
          className="
            bg-black
            hover:bg-gray-900
            transition-all
            duration-300
            text-white
            px-10
            py-4
            rounded-xl
            font-semibold
            shadow-sm
          "
        >

          Add To Cart

        </button>

        <button
          className="
            border
            border-black
            hover:bg-black
            hover:text-white
            transition-all
            duration-300
            px-10
            py-4
            rounded-xl
            font-semibold
          "
        >

          Buy Now

        </button>

      </div>

    </div>

  );
};

export default ProductInfo;