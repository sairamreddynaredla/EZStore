import { useEffect, useMemo, useRef, useState } from "react";
import {
  resolveProductGalleryImages,
  resolveProductImageFallback,
} from "../../utils/productImage";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ProductGallery = ({ product }) => {
  const images = useMemo(() => resolveProductGalleryImages(product), [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(images[0]);
  const [zoomActive, setZoomActive] = useState(false);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    setActiveImage(images[0]);
    setActiveIndex(0);
  }, [images]);

  useEffect(() => {
    setActiveImage(images[activeIndex] || images[0]);
  }, [activeIndex, images]);

  const imageContainerRef = useRef(null);

  const zoomScale = 2.5;

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    [activeIndex - 1, activeIndex + 1].forEach((index) => {
      if (images[index]) {
        const img = new Image();
        img.src = images[index];
      }
    });
  }, [activeIndex, images]);

  const handlePointerMove = (event) => {
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = event.clientX ?? event.touches?.[0]?.clientX;
    const clientY = event.clientY ?? event.touches?.[0]?.clientY;
    if (clientX == null || clientY == null) return;

    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((clientY - rect.top) / rect.height, 0, 1);

    setPointer({ x, y });
  };

  const activateZoom = () => setZoomActive(true);
  const deactivateZoom = () => setZoomActive(false);

  const handleThumbnailHover = (index) => {
    setActiveIndex(index);
    setZoomActive(false);
  };

  const hasMultipleImages = images.length > 1;
  const zoomStyle = {
    transform: zoomActive ? `scale(${zoomScale})` : "scale(1)",
    transformOrigin: `${pointer.x * 100}% ${pointer.y * 100}%`,
  };

  const goPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
    setZoomActive(false);
  };

  const goNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
    setZoomActive(false);
  };

  return (
    <div className="w-full">
      <div className="grid gap-6 sm:gap-8">
        <div className="relative overflow-hidden rounded-lg sm:rounded-2xl lg:rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div
            ref={imageContainerRef}
            className="relative aspect-square w-full overflow-hidden bg-white"
            onMouseMove={handlePointerMove}
            onMouseEnter={activateZoom}
            onMouseLeave={deactivateZoom}
            onTouchStart={(event) => {
              if (event.touches[0]) {
                handlePointerMove(event.touches[0]);
              }
              activateZoom();
            }}
            onTouchMove={(event) => {
              if (event.touches[0]) {
                handlePointerMove(event.touches[0]);
              }
            }}
            onTouchEnd={deactivateZoom}
          >
            <img
              src={activeImage}
              alt={product.name}
              style={zoomStyle}
              className="absolute inset-0 h-full w-full object-contain transition-transform duration-200"
              onError={(e) => {
                e.currentTarget.onerror = null;
                const fallbackImage = resolveProductImageFallback(product);
                if (activeImage !== fallbackImage) {
                  setActiveImage(fallbackImage);
                }
              }}
            />

            {zoomActive && (
              <div
                className="pointer-events-none absolute z-10 h-24 w-24 rounded-lg border border-slate-300 bg-white/10 shadow-lg"
                style={{
                  left: `${pointer.x * 100}%`,
                  top: `${pointer.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={goPrevious}
                  aria-label="Previous image"
                  className="absolute left-2 sm:left-4 top-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white hover:shadow-lg transition-all font-bold text-xl"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className="absolute right-2 sm:right-4 top-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white hover:shadow-lg transition-all font-bold text-xl"
                >
                  ›
                </button>
              </>
            )}
          </div>

          <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 hide-scrollbar px-2 sm:px-4">
            {images.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => handleThumbnailHover(index)}
                onFocus={() => handleThumbnailHover(index)}
                className={`h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg sm:rounded-2xl border transition duration-150 focus:outline-none ${
                  activeIndex === index
                    ? "border-gray-900 bg-slate-100 ring-2 ring-offset-1 ring-gray-400"
                    : "border-gray-300 hover:border-gray-700 bg-white"
                }`}
                aria-label={`Preview image ${index + 1}`}
                aria-pressed={activeIndex === index}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = resolveProductImageFallback(product);
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
