import { Link } from "react-router-dom";
import { useState } from "react";
import { categoryBanners } from "../../data/categoryBanners";

const MegaMenuSection = ({ sections, banner: defaultBanner, showBanner = true, onClick }) => {
  const [activeBanner, setActiveBanner] = useState({ image: defaultBanner, title: "", subtitle: "" });

  const handleHover = (slug) => {
    if (!showBanner) return;

    if (!slug) {
      setActiveBanner({ image: defaultBanner, title: "", subtitle: "" });
      return;
    }

    const data = categoryBanners[slug];

    if (data) {
      setActiveBanner({ image: data.image, title: data.title || "", subtitle: data.subtitle || "" });
    } else {
      setActiveBanner({ image: defaultBanner, title: "", subtitle: "" });
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-gray-800 mb-3 uppercase text-sm tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      to={cat.path}
                      onClick={onClick}
                      onMouseEnter={() => handleHover(cat.slug)}
                      onFocus={() => handleHover(cat.slug)}
                      onTouchStart={() => handleHover(cat.slug)}
                      className="block text-gray-700 hover:text-primary-600 rounded px-1 py-0.5 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {showBanner && (
          <div className="hidden lg:block lg:col-span-1">
          <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
            {activeBanner.image ? (
              <img src={activeBanner.image} alt={activeBanner.title || "banner"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No banner</div>
            )}
          </div>

          {(activeBanner.title || activeBanner.subtitle) && (
            <div className="mt-3">
              <div className="font-semibold text-gray-900">{activeBanner.title}</div>
              <div className="text-sm text-gray-500">{activeBanner.subtitle}</div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenuSection;