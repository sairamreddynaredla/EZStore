import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductImageGallery = ({ images = [], productName = "Product" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const displayImages = images && images.length > 0 ? images : [""];
  const currentImage = displayImages[currentImageIndex];
  const hoverImage =
    displayImages.length > 1 ? displayImages[(currentImageIndex + 1) % displayImages.length] : null;
  const hasMultipleImages = displayImages.length > 1;

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="relative bg-slate-50 h-72 md:h-80 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!imageLoaded && <div className="absolute inset-0 bg-slate-200 animate-pulse" />}

      <div className="relative h-full w-full">
        <img
          src={currentImage}
          alt={productName}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-200 ease-out ${
            isHovered ? "scale-[1.02]" : "scale-100"
          } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${productName} alternate view`}
            className={`absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-200 ease-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        )}
      </div>

      {hasMultipleImages && (
        <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-slate-950/80 px-3 py-1 text-xs text-white">
          {currentImageIndex + 1}/{displayImages.length}
        </div>
      )}

      {hasMultipleImages && isHovered && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow transition"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow transition"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {hasMultipleImages && (
        <div className="absolute bottom-3 right-3 z-10 flex gap-2 rounded-3xl bg-white/90 p-2 shadow-sm">
          {displayImages.slice(0, 3).map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImageIndex(idx);
              }}
              className={`h-10 w-10 overflow-hidden rounded-2xl border transition ${
                currentImageIndex === idx
                  ? "border-orange-500"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
          {displayImages.length > 3 && (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-xs font-semibold text-slate-700">
              +{displayImages.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
