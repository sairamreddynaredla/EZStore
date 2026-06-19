const ProductBadges = ({
  badges = [],
  isBestSeller = false,
  isNew = false,
  isTrending = false,
  stock = 0,
  soldCount = 0,
}) => {
  const allBadges = [];

  if (isBestSeller || soldCount > 200) {
    allBadges.push({
      id: "bestseller",
      label: "Bestseller",
      color: "bg-orange-500",
    });
  }

  if (isNew) {
    allBadges.push({
      id: "new",
      label: "New",
      color: "bg-green-500",
    });
  }

  if (isTrending) {
    allBadges.push({
      id: "trending",
      label: "Trending",
      color: "bg-pink-500",
    });
  }

  if (stock > 0 && stock < 10) {
    allBadges.push({
      id: "low-stock",
      label: "Limited Stock",
      color: "bg-red-500",
    });
  }

  if (badges && badges.length > 0) {
    allBadges.push(...badges);
  }

  if (allBadges.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 max-w-[120px]">
      {allBadges.slice(0, 3).map((badge) => (
        <span
          key={badge.id || badge.label}
          className={`${
            badge.color || "bg-blue-500"
          } text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap truncate animate-pulse hover:animate-none transition-all`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
};

export default ProductBadges;
