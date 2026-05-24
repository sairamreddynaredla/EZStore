import { useState } from "react";
import useCart from "../../hooks/usecart";
import AddToCartButton from "../products/AddToCartButton";
import BuyNowButton from "../BuyNowButton";

const ProductInfo = ({ product, handleBuyNow }) => {

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

  const productBadge =
    product.rating >= 4.8
      ? "Top Rated"
      : null;

  return (

    <div className="space-y-7">

      {/* Brand */}

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm uppercase tracking-[2px] text-gray-500 font-medium">
          {product.brand}
        </p>
        {productBadge && (
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            {productBadge}
          </span>
        )}
      </div>

      {/* Product Title */}

      <h1 className="text-4xl font-bold leading-tight text-gray-900">
        {product.name}
      </h1>

      {/* Ratings */}

      <div className="flex flex-wrap items-center gap-4">

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

        <span className="h-1 w-1 rounded-full bg-slate-300" />

        <p className="text-sm text-slate-500">
          {product.category} • {product.brand}
        </p>

      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          Ships from <span className="font-semibold text-slate-900">Pet Food Store</span>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          Sold by <span className="font-semibold text-slate-900">Pet Food Store</span>
        </div>
      </div>

      {/* Pricing */}

      <div className="flex flex-wrap items-center gap-4">

        <h2 className="text-4xl font-bold text-green-600">
          ${selectedVariant?.price || product.price}
        </h2>

        {(selectedVariant?.originalPrice || product.oldPrice) > (selectedVariant?.price || product.price) && (
          <span className="text-2xl text-gray-400 line-through">
            ${selectedVariant?.originalPrice || product.oldPrice}
          </span>
        )}

        {discountPercentage > 0 && (

          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
            {discountPercentage}% OFF
          </span>

        )}

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="font-semibold text-slate-900">Delivery</p>
          <p>{product.deliveryDate || 'Delivered in 3-5 business days'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="font-semibold text-slate-900">Return</p>
          <p>30-day hassle-free returns</p>
        </div>
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

      <div className="space-y-4 pt-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
          <AddToCartButton
            product={{
              ...product,
              selectedVariant,
              quantity,
            }}
            isOutOfStock={product.stock <= 0}
            onAddToCart={addToCart}
            quantity={quantity}
          />
          <BuyNowButton
            onClick={handleBuyNow}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
          </BuyNowButton>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-4 py-2">Secure payment</span>
          <span className="rounded-full bg-slate-100 px-4 py-2">Fast delivery</span>
          <span className="rounded-full bg-slate-100 px-4 py-2">30-day returns</span>
        </div>
      </div>

    </div>

  );
};

export default ProductInfo;