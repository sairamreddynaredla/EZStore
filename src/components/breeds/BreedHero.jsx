const BreedHero = ({ breed }) => {
  return (
    <section className="bg-[#fff8ed] rounded-[40px] overflow-hidden shadow-[0_32px_120px_rgba(15,23,42,0.08)]">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] items-stretch gap-6">

        {/* LEFT CONTENT */}
        <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16 flex flex-col justify-center overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#ffd98c] opacity-70 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#ffe8c5] opacity-80 blur-2xl"></div>

          <div className="relative z-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-orange-600 font-semibold mb-4">
              Meet the breed
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 mb-5 max-w-2xl">
              {breed.title || breed.name}
            </h1>

            <p className="text-base sm:text-lg leading-8 text-slate-700 mb-8 max-w-2xl">
              {breed.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {breed?.traits?.map((item, index) => (
                <span
                  key={index}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500 mb-2">Best for</p>
                <p className="text-base font-semibold text-slate-900">Families, active homes, therapy work</p>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500 mb-2">Care level</p>
                <p className="text-base font-semibold text-slate-900">Friendly, loyal, moderately active</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative overflow-hidden rounded-4xl bg-slate-100">
          <img
            src={breed.image}
            alt={breed.name}
            className="w-full h-full min-h-115 object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default BreedHero;