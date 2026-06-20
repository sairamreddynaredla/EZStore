import { Leaf, Ban, Dog, ChevronRight } from "lucide-react";
import dogBanner1 from "../../assets/banners/dog-banner.webp";

const HeroBanner = () => {
  return (
    <section aria-label="Homepage hero" className="w-full h-80 sm:h-96 md:h-[500px] lg:h-[600px]">
      <div className="max-w-full mx-auto relative overflow-hidden h-full">
        <img
          src={dogBanner1}
          alt="Dog and pet products banner"
          className="w-full h-full object-contain bg-[#F7F0E3]"
        />

        {/* Content overlay - users can customize this */}
        <div className="absolute inset-0 flex flex-col justify-center items-start p-2 sm:p-4 md:p-12 z-10">
          <div className="max-w-xs sm:max-w-md md:max-w-xl">
            <h1
              className="text-[#8B4513] font-extrabold leading-tight tracking-tight mb-1 sm:mb-3 md:mb-6 text-sm sm:text-lg md:text-5xl lg:text-6xl"
              style={{ fontWeight: 800 }}
            >
              <span className="block">From Fresh</span>
              <span className="block">Meals to Happy</span>
              <span className="block">Treats.</span>
            </h1>

            <p className="text-xs sm:text-xs md:text-lg lg:text-xl text-[#222] mb-2 sm:mb-4 md:mb-8">
              A Complete Dog Nutrition Range.
            </p>

            <div className="flex items-center gap-1 sm:gap-3 md:gap-6 mb-2 sm:mb-5 md:mb-8 flex-wrap">
              <div className="flex flex-col items-center text-center">
                <div className="w-5 sm:w-9 md:w-12 lg:w-16 h-5 sm:h-9 md:h-12 lg:h-16 rounded-full border border-[#8B4513] flex items-center justify-center mb-0.5 sm:mb-1 md:mb-2">
                  <Leaf size={10} className="text-[#8B4513] sm:w-4 md:w-6 lg:w-7" />
                </div>
                <div className="text-xs sm:text-xs md:text-base font-medium text-[#3F3F46]">
                  Real
                  <br />
                  Ingredients
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-5 sm:w-9 md:w-12 lg:w-16 h-5 sm:h-9 md:h-12 lg:h-16 rounded-full border border-[#8B4513] flex items-center justify-center mb-0.5 sm:mb-1 md:mb-2">
                  <Ban size={10} className="text-[#8B4513] sm:w-4 md:w-6 lg:w-7" />
                </div>
                <div className="text-xs sm:text-xs md:text-base font-medium text-[#3F3F46]">
                  No
                  <br />
                  Preservatives
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-5 sm:w-9 md:w-12 lg:w-16 h-5 sm:h-9 md:h-12 lg:h-16 rounded-full border border-[#8B4513] flex items-center justify-center mb-0.5 sm:mb-1 md:mb-2">
                  <Dog size={10} className="text-[#8B4513] sm:w-4 md:w-6 lg:w-7" />
                </div>
                <div className="text-xs sm:text-xs md:text-base font-medium text-[#3F3F46]">
                  For All
                  <br />
                  Breeds
                </div>
              </div>
            </div>

            <a
              href="/shop"
              className="inline-flex items-center justify-center gap-0.5 sm:gap-1 bg-[#F59E0B] hover:bg-[#E59C0D] text-white rounded-full transition-transform duration-150 hover:scale-105 px-2 sm:px-3 md:px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-xs md:text-base lg:text-lg font-bold w-fit"
            >
              <span>SHOP NOW</span>
              <ChevronRight size={10} className="text-white sm:w-3 md:w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
