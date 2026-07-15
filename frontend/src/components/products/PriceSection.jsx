const PriceSection = ({ price = 0, originalPrice = 0, currency = "$" }) => {
  const discountAmount = originalPrice - price;
  const discountPercentage =
    originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;
  const hasDiscount = discountPercentage > 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-lg md:text-xl font-bold text-gray-900">
          {currency}
          {price.toLocaleString()}
        </span>

        {hasDiscount && (
          <>
            <span className="text-xs md:text-sm text-gray-400 line-through">
              {currency}
              {originalPrice.toLocaleString()}
            </span>
            <span className="text-xs md:text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>

      {hasDiscount && (
        <span className="text-xs text-gray-500">
          Save {currency}
          {discountAmount.toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default PriceSection;
