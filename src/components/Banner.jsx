const Banner = ({ image, title, tagline, bg = "#E8F5F0" }) => {
  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl mb-8 min-h-80 md:min-h-105 flex items-center"
      style={{ backgroundColor: bg }}
    >
      {/* Background Image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Content */}
      <div className="relative z-10 px-6 md:px-14 py-10 max-w-2xl">
        <p className="text-white/90 text-sm md:text-base font-medium tracking-wide uppercase mb-3">
          Premium Pet Care
        </p>

        <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
          {title}
        </h2>

        <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6">{tagline}</p>

        <button className="bg-[#1F6B52] hover:bg-[#185441] transition-all duration-300 text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default Banner;
