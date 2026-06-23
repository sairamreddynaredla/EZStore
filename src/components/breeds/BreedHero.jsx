const BreedHero = ({ breed }) => {
  return (
    <section className="bg-[#fff8ed] rounded-[40px] overflow-hidden shadow-[0_32px_120px_rgba(15,23,42,0.08)] mb-12">
      <div className="grid lg:grid-cols-[1.4fr_0.6fr] items-stretch gap-8">
        {/* LEFT CONTENT */}
        <div className="relative px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16 flex flex-col justify-center overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#ffd98c] opacity-70 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#ffe8c5] opacity-80 blur-2xl"></div>

          <div className="relative z-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-orange-600 font-semibold mb-4">
              Meet the breed
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 mb-4 max-w-2xl">
              {breed.name}
            </h1>

            <p className="text-sm sm:text-base leading-6 text-slate-700 mb-6 max-w-2xl">
              {breed.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {breed?.traits?.map((item, index) => (
                <span
                  key={index}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500 mb-2">
                  Best for
                </p>
                <p className="text-base font-semibold text-slate-900">
                  Families, active homes, therapy work
                </p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500 mb-2">
                  Care level
                </p>
                <p className="text-base font-semibold text-slate-900">
                  Friendly, loyal, moderately active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative overflow-hidden rounded-4xl bg-slate-100 flex items-center justify-center">
          <img
            src={breed.image}
            alt={breed.name}
            className="w-full h-full sm:min-h-[240px] md:min-h-[320px] lg:min-h-[420px] object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default BreedHero;
