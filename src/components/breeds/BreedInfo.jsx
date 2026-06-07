const BreedInfo = ({ breed }) => {
  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
      <div className="bg-white rounded-[30px] p-8 md:p-10 shadow-sm border border-slate-200">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-950 mb-4">At a glance</h2>
        <p className="text-slate-600 leading-7">
          Golden Retrievers are affectionate and adaptable companions that suit active households, therapy work, and growing families. Their friendly temperament and eagerness to please make them easy to train and a joy to live with.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Size</p>
          <p className="text-2xl font-semibold text-slate-900">{breed.size}</p>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Lifespan</p>
          <p className="text-2xl font-semibold text-slate-900">{breed.lifespan}</p>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Weight</p>
          <p className="text-2xl font-semibold text-slate-900">{breed.weight}</p>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Grooming</p>
          <p className="text-2xl font-semibold text-slate-900">{breed.grooming}</p>
        </article>
      </div>
    </section>
  );
};

export default BreedInfo;
