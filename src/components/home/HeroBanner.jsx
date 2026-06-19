import { Leaf, Ban, Dog, ChevronRight } from "lucide-react";
import dogBanner1 from "../../assets/banners/dog-banner.webp";

const HeroBanner = () => {
  return (
    <section aria-label="Homepage hero" className="w-full">
      <div
        className="max-w-[1440px] mx-auto relative min-h-[520px] lg:min-h-[650px]"
        style={{ height: "clamp(520px, 60vh, 700px)" }}
      >
        {/* Image: use existing asset, cover, centered, provide aspect-ratio and eager loading to avoid CLS */}
        <img
          src={dogBanner1}
          srcSet={`${dogBanner1} 1200w, ${dogBanner1} 1800w`}
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="eager"
          alt="Dog and pet products banner"
          className="w-full object-cover object-center block md:h-[520px] h-[280px] lg:absolute lg:inset-0 lg:w-full lg:h-full"
          style={{ aspectRatio: "16/7" }}
        />

        {/* Content block: stacked on mobile (below image), absolute-left on large screens */}
        <div className="relative z-10">
          <div className="px-6 py-6 md:py-8 lg:py-0 lg:px-0">
            <div className="mx-auto md:max-w-[720px] lg:max-w-none">
              {/* Left content wrapper - on lg screens absolute positioned */}
              <div className="lg:absolute lg:left-[60px] lg:top-1/2 lg:-translate-y-1/2 lg:w-[480px] lg:z-10">
                <h1
                  className="text-[#8B4513] font-extrabold leading-[0.95] tracking-[-0.04em] mb-6 text-[42px] md:text-[56px] lg:text-[72px]"
                  style={{ fontWeight: 800 }}
                >
                  <span className="block">From Fresh Meals</span>
                  <span className="block">to Happy Treats.</span>
                </h1>

                <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#222] mt-6 mb-10">
                  A Complete Dog Nutrition Range.
                </p>

                <div className="flex items-center gap-3 md:gap-6 lg:gap-8 mb-8 md:mb-10 flex-wrap md:flex-nowrap">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] lg:w-[60px] lg:h-[60px] rounded-full border border-[#8B4513] flex items-center justify-center mb-2 md:mb-3">
                      <Leaf size={20} className="text-[#8B4513] md:w-[25px] lg:w-[30px]" />
                    </div>
                    <div className="text-[12px] md:text-[14px] lg:text-[15px] font-medium text-[#3F3F46]">
                      Real
                      <br />
                      Ingredients
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] lg:w-[60px] lg:h-[60px] rounded-full border border-[#8B4513] flex items-center justify-center mb-2 md:mb-3">
                      <Ban size={20} className="text-[#8B4513] md:w-[25px] lg:w-[30px]" />
                    </div>
                    <div className="text-[12px] md:text-[14px] lg:text-[15px] font-medium text-[#3F3F46]">
                      No
                      <br />
                      Preservatives
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] lg:w-[60px] lg:h-[60px] rounded-full border border-[#8B4513] flex items-center justify-center mb-2 md:mb-3">
                      <Dog size={20} className="text-[#8B4513] md:w-[25px] lg:w-[30px]" />
                    </div>
                    <div className="text-[12px] md:text-[14px] lg:text-[15px] font-medium text-[#3F3F46]">
                      For All
                      <br />
                      Breeds
                    </div>
                  </div>
                </div>

                <a
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 bg-[#F59E0B] text-white rounded-full transition-transform duration-150 hover:scale-105 px-4 md:px-8 py-2 md:py-3 text-sm md:text-base lg:text-lg font-bold w-full sm:w-auto max-w-xs"
                >
                  <span>SHOP NOW</span>
                  <ChevronRight size={16} className="text-white md:w-[20px] lg:w-[24px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
