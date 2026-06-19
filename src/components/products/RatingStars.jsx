import { Star } from "lucide-react";

const RatingStars = ({ rating = 0, reviewCount = 0, size = "md" }) => {
  const sizeClasses = {
    sm: "w-3 h-3 text-[10px]",
    md: "w-4 h-4 text-xs",
    lg: "w-5 h-5 text-sm",
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className={`${sizeClasses[size]} text-gray-300`} />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className={`${sizeClasses[size]} text-gray-300`} />);
      }
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">{renderStars()}</div>
      {reviewCount > 0 && (
        <span className="text-xs text-gray-500 font-medium">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
};

export default RatingStars;
