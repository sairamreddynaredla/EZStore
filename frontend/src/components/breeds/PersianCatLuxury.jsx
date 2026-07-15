// Luxury Persian Cat Breed Page Component
const PersianCatLuxury = ({ breed }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#fdf6ee] to-[#f7efe6] pb-24">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-auto md:min-h-screen py-6 md:py-0 overflow-hidden">
        {/* Floating blobs */}
        <div className="absolute -top-20 -left-20 w-75 h-75 bg-linear-to-br from-[#fbe7c6] to-[#f6d365] rounded-full blur-3xl opacity-40 z-0 hidden md:block"></div>
        <div className="absolute -bottom-25 -right-25 w-87.5 h-87.5 bg-linear-to-tr from-[#f6e7d8] to-[#f9e7b7] rounded-full blur-3xl opacity-30 z-0 hidden md:block"></div>
        {/* Main Card */}
        <div className="relative z-10 bg-white/60 backdrop-blur-xl rounded-2xl md:rounded-[40px] shadow-2xl border border-[#f6e7d8] flex flex-row max-w-5xl mx-auto p-3 sm:p-6 md:p-12 gap-3 sm:gap-6 md:gap-12 items-center md:items-stretch min-h-auto md:min-h-[70vh] justify-center">
          <div className="flex-1 flex flex-col justify-center md:justify-center items-center md:items-start">
            <span className="inline-block bg-linear-to-r from-[#fbe7c6] to-[#f6d365] text-[#bfa76a] px-3 sm:px-5 py-1 sm:py-2 rounded-full font-semibold mb-2 sm:mb-4 shadow-md text-xs sm:text-base">
              Luxury Breed
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl md:text-7xl font-bold text-[#bfa76a] mb-2 sm:mb-4 md:mb-6 drop-shadow-lg">
              {breed.name}
            </h1>
            <p className="text-xs sm:text-base md:text-xl text-[#7c6f57] mb-3 sm:mb-6 md:mb-8 font-light max-w-lg">{breed.description}</p>
            <button className="bg-linear-to-r from-[#fbe7c6] to-[#f6d365] text-[#7c6f57] font-bold px-4 sm:px-8 py-2 sm:py-4 rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 text-xs sm:text-base md:text-lg">
              Meet Your Persian
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-2 sm:gap-4 md:gap-6 justify-center items-center md:items-end md:justify-center">
            <img
              src="/persian cat.webp"
              alt="Persian Cat Hero"
              className="rounded-xl sm:rounded-[2.5rem] shadow-xl w-32 sm:w-56 md:w-80 h-40 sm:h-72 md:h-100 object-cover border-2 sm:border-4 border-[#fbe7c6]"
            />
          </div>
        </div>
      </section>

      {/* Breed Statistics Cards */}
      <section className="max-w-5xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {[
          { label: "Origin", value: breed.overview?.origin },
          { label: "Lifespan", value: breed.overview?.lifespan },
          { label: "Weight", value: breed.overview?.weight },
          { label: "Coat", value: breed.overview?.coat },
          {
            label: "Eye Color",
            value: (breed.overview?.eyeColor || []).join(", "),
          },
          { label: "Energy Level", value: breed.overview?.energyLevel },
          { label: "Affection", value: breed.overview?.affectionLevel },
          { label: "Intelligence", value: breed.overview?.intelligence },
          { label: "Shedding", value: breed.overview?.sheddingLevel },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-lg border border-[#fbe7c6] p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <span className="font-serif text-lg text-[#bfa76a] mb-2">{stat.label}</span>
            <span className="font-bold text-2xl text-[#7c6f57]">{stat.value}</span>
          </div>
        ))}
      </section>

      {/* Signature Portrait & Essence Section */}
      <section className="max-w-5xl mx-auto min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-row items-center gap-10 bg-white/70 rounded-[2.5rem] shadow-xl border border-[#fbe7c6] p-8 md:p-12 w-full">
          <div className="shrink-0 w-full md:w-[320px] flex flex-col items-center mb-0">
            <img
              src="/elegance.webp"
              alt="Persian Cat Elegance"
              className="rounded-[2.5rem] shadow-lg w-75 h-105 object-cover border-4 border-[#bfa76a] bg-white mb-4"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl text-[#bfa76a] font-bold mb-4">
              The Essence of Persian Elegance
            </h2>
            <p className="text-lg md:text-xl text-[#7c6f57] font-light mb-4">
              Persian Cats are the epitome of grace and tranquility. Their gentle nature, soulful
              eyes, and plush coats create an aura of calm sophistication. Whether basking in a
              sunbeam or curled up in your lap, they bring a sense of peace and luxury to any home.
            </p>
            <ul className="mt-2 space-y-2 text-[#bfa76a] text-base md:text-lg font-medium list-disc ml-5">
              <li>Regal presence and affectionate companionship</li>
              <li>Quiet, observant, and deeply loyal</li>
              <li>Perfect for serene, loving households</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Grooming Cards with Image */}
      <section className="max-w-5xl mx-auto mt-20 px-4">
        {/* Add photo here later */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {[
            { title: "Daily Grooming", desc: breed.grooming?.daily },
            { title: "Brushing", desc: breed.grooming?.brushing },
            { title: "Bathing", desc: breed.grooming?.bathing },
            { title: "Eye Cleaning", desc: breed.grooming?.eyes },
            { title: "Nail Trimming", desc: breed.grooming?.nails },
            { title: "Ear Cleaning", desc: breed.grooming?.ears },
            { title: "Seasonal Care", desc: breed.grooming?.seasonal },
            { title: "Pro Tips", desc: breed.grooming?.tips },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-lg border border-[#fbe7c6] p-6 flex flex-col justify-between hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="font-serif text-xl text-[#bfa76a] font-bold mb-2">{item.title}</h3>
              <p className="text-[#7c6f57] text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Health & Wellness Section */}
      <section className="max-w-5xl mx-auto mt-20 px-4">
        <div className="flex flex-row items-center gap-10 bg-white/70 rounded-[2.5rem] shadow-xl border border-[#fbe7c6] p-8 md:p-12">
          <div className="shrink-0 w-full md:w-85 flex flex-col items-center mb-6 md:mb-0">
            <img
              src="/persian 1.webp"
              alt="Persian Cat Health"
              className="rounded-[2.5rem] shadow-2xl w-75 h-105 object-cover border-4 border-[#fbe7c6] bg-white"
            />
            <div className="w-full px-4 py-3 mt-2 bg-black/60 rounded-b-[28px] text-center">
              <span className="text-white text-lg font-semibold drop-shadow">
                Persian Cat Health & Wellness
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl text-[#bfa76a] font-bold mb-4">
              Health & Wellness
            </h2>
            <p className="text-lg md:text-xl text-[#7c6f57] font-light mb-4">
              Persian Cats are generally healthy but require attentive care due to their luxurious
              coats and unique facial structure. Regular grooming, a balanced diet, and routine vet
              visits are essential for their well-being.
            </p>
            <ul className="mt-2 space-y-2 text-[#bfa76a] text-base md:text-lg font-medium list-disc ml-5">
              <li>Brush daily to prevent mats and tangles</li>
              <li>Watch for signs of breathing or eye issues</li>
              <li>Provide a calm, clean environment</li>
              <li>Schedule regular veterinary checkups</li>
              <li>Feed high-quality, protein-rich food</li>
            </ul>
            <p className="italic text-[#bfa76a] mt-6">
              Always consult your veterinarian for personalized advice.
            </p>
          </div>
        </div>
      </section>

      {/* Product Recommendations with Playful Cat Image */}
      <section className="max-w-6xl mx-auto mt-20 px-4">
        <h2 className="font-serif text-4xl text-[#bfa76a] font-bold mb-8">
          Curated for Persian Cats
        </h2>
        {/* Add photo here later */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {Object.entries(breed.recommendations || {}).map(([cat, items], i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-lg border border-[#fbe7c6] p-6 flex flex-col justify-between hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="font-serif text-xl text-[#bfa76a] font-bold mb-2 capitalize">{cat}</h3>
              <ul className="list-disc ml-5 text-[#7c6f57]">
                {items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto mt-20 px-4">
        <h2 className="font-serif text-4xl text-[#bfa76a] font-bold mb-8">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-[#fbe7c6] rounded-3xl shadow-xl bg-white/70">
          {(breed.faqs || []).map((faq, i) => (
            <details
              key={i}
              className="group p-6 cursor-pointer transition-all duration-300 hover:bg-[#fbe7c6]/20"
            >
              <summary className="font-bold text-lg text-[#bfa76a] flex items-center justify-between">
                {faq.question}
                <span className="ml-2 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-3 text-[#7c6f57] text-base">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Adoption Section */}
      <section className="max-w-4xl mx-auto mt-20 px-4">
        <div className="bg-linear-to-br from-[#fbe7c6]/60 to-[#f6d365]/60 rounded-[2.5rem] shadow-xl border border-[#fbe7c6] p-10 flex flex-col items-center">
          <h2 className="font-serif text-4xl text-[#bfa76a] font-bold mb-4">
            Adoption & Buying Guide
          </h2>
          <ul className="list-disc ml-5 text-[#7c6f57] mb-6">
            {breed.adoption?.tips?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
            {breed.adoption?.ethical?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
            {breed.adoption?.redFlags?.map((tip, i) => (
              <li key={i} className="text-red-400">
                {tip}
              </li>
            ))}
            {breed.adoption?.questions?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
            {breed.adoption?.checklist?.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
          <button className="bg-linear-to-r from-[#fbe7c6] to-[#f6d365] text-[#7c6f57] font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 text-lg">
            Adopt Responsibly
          </button>
        </div>
      </section>

      {/* Emotional Closing Section */}
      <section className="max-w-3xl mx-auto mt-20 px-4">
        <div className="bg-white/80 rounded-[2.5rem] shadow-xl border border-[#fbe7c6] p-10 text-center">
          <h2 className="font-serif text-3xl text-[#bfa76a] font-bold mb-4">
            A Lifetime of Luxury & Love
          </h2>
          <p className="text-[#7c6f57] text-lg">{breed.closing}</p>
        </div>
      </section>
    </div>
  );
};

export default PersianCatLuxury;
