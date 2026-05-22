import { useParams } from "react-router-dom";
import breedData from "../../data/breeds";
import BreedHero from "../../components/breeds/BreedHero";
import BreedInfo from "../../components/breeds/BreedInfo";
import BreedNutrition from "../../components/breeds/BreedNutrition";
import BreedGrooming from "../../components/breeds/BreedGrooming";
import BreedFAQ from "../../components/breeds/BreedFaq";
import BreedSlider from "../../components/breeds/BreedSlider";
import PersianCatLuxury from "../../components/breeds/PersianCatLuxury";

const BreedDetails = () => {
  const { slug } = useParams();

  const breed = breedData.find((b) => b.slug === slug);

  if (!breed) {
    return (
      <div className="text-center py-20 text-3xl font-bold text-gray-400">
        🐾 Breed Not Found
      </div>
    );
  }

  // BreedInfo expects flat object: {size, lifespan, weight, grooming}
  const infoData = {
    size:     breed.info?.size      || breed.overview?.size      || "—",
    lifespan: breed.info?.lifespan  || breed.overview?.lifespan  || "—",
    weight:   breed.info?.weight    || breed.overview?.weight    || "—",
    grooming: breed.info?.grooming  || breed.overview?.shedding  || breed.info?.shedding || "—",
  };

  // Nutrition: normalize featurePoints -> tips for BreedNutrition
  const nutritionData = breed.nutrition
    ? {
        ...breed.nutrition,
        image: breed.nutrition.bannerImage || breed.nutrition.image,
        description: breed.nutrition.subtitle || breed.nutrition.description || "",
        tips: breed.nutrition.tips || breed.nutrition.featurePoints || [],
      }
    : null;

  // Grooming: normalize leftCard/rightCard points -> tips for BreedGrooming
  let groomingTips = breed.grooming?.tips || [];
  if (!groomingTips.length && breed.grooming?.leftCard) {
    groomingTips = [
      ...(breed.grooming.leftCard.points || []),
      ...(breed.grooming.rightCard?.points || []),
    ];
  }
  const groomingData = breed.grooming
    ? { ...breed.grooming, tips: groomingTips }
    : null;

  // Other breeds same category for slider
  const otherBreeds = breedData.filter(
    (b) => b.slug !== slug && b.category === breed.category
  );

  // Render luxury Persian Cat UI if slug is persian-cat
  if (breed.slug === "persian-cat") {
    return <PersianCatLuxury breed={breed} />;
  }

  // ...existing code for other breeds...
  return (
    <div className="max-w-6xl mx-auto px-6 pt-[120px] pb-10">
      {/* ...existing code... */}
      <BreedHero breed={breed} />
      <BreedInfo breed={infoData} />
      {nutritionData && (
        <BreedNutrition breed={{ ...breed, nutrition: nutritionData }} />
      )}
      {groomingData && (
        <BreedGrooming breed={{ ...breed, grooming: groomingData }} />
      )}
      {breed.training && (
        <section className="mt-14 px-6">
          <div className="bg-[#dce8f9] rounded-[30px] p-10">
            <h2 className="text-4xl font-bold mb-10">{breed.training.title}</h2>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <img src={breed.training.image} alt={breed.name} className="w-full rounded-[24px] object-cover" />
              </div>
              <div>
                {breed.training.description && (
                  <p className="text-lg text-gray-700 leading-8 mb-8">{breed.training.description}</p>
                )}
                <div className="space-y-4">
                  {(breed.training.trainingTips || breed.training.tips || []).map((item, i) => (
                    <div key={i} className="bg-white rounded-[20px] p-5 border">
                      <h3 className="font-semibold text-lg">{item}</h3>
                    </div>
                  ))}
                </div>
                {breed.training.activities && (
                  <div className="mt-8">
                    <h3 className="font-bold text-xl mb-4">Activities</h3>
                    <div className="flex flex-wrap gap-3">
                      {breed.training.activities.map((act, i) => (
                        <span key={i} className="bg-white border rounded-full px-5 py-2 font-semibold text-sm">{act}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      {breed.puppyCare && (
        <section className="mt-14 px-6">
          <div className="bg-[#fce4ec] rounded-[30px] p-10">
            <h2 className="text-4xl font-bold mb-10">{breed.puppyCare.title}</h2>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {breed.puppyCare.image && (
                <div>
                  <img src={breed.puppyCare.image} alt={breed.name} className="w-full rounded-[24px] object-cover" />
                </div>
              )}
              <div>
                {breed.puppyCare.description && (
                  <p className="text-lg text-gray-700 leading-8 mb-8">{breed.puppyCare.description}</p>
                )}
                {breed.puppyCare.careTips && (
                  <div className="mb-6">
                    <h3 className="font-bold text-xl mb-4">Care Tips</h3>
                    <div className="space-y-4">
                      {breed.puppyCare.careTips.map((tip, i) => (
                        <div key={i} className="bg-white rounded-[20px] p-5 border"><h3 className="font-semibold text-lg">{tip}</h3></div>
                      ))}
                    </div>
                  </div>
                )}
                {breed.puppyCare.trainingBasics && (
                  <div>
                    <h3 className="font-bold text-xl mb-4">Training Basics</h3>
                    <div className="flex flex-wrap gap-3">
                      {breed.puppyCare.trainingBasics.map((item, i) => (
                        <span key={i} className="bg-white border rounded-full px-5 py-2 font-semibold text-sm">{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {breed.lifestyle && (
  <section className="mt-16 px-4 md:px-6">

    <div className="bg-[#f0e6ff] rounded-[40px] p-6 md:p-10 lg:p-14 overflow-hidden">

      <h2 className="text-3xl md:text-5xl font-bold mb-10">
        {breed.lifestyle.title}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* IMAGE SIDE */}

        <div className="w-full">

          <div className="relative aspect-[4/4.2] rounded-[32px] overflow-hidden bg-[#e5b800]">

            <img
              src={breed.lifestyle.bannerImage || breed.lifestyle.image}
              alt={breed.name}
              className="
                absolute inset-0
                w-full h-full
                object-contain
                hover:scale-105
                transition duration-500
              "
            />

          </div>

        </div>

        {/* CONTENT SIDE */}

        <div>

          {breed.lifestyle.description && (
            <p className="text-[18px] md:text-[21px] text-gray-700 leading-[1.9] mb-8">
              {breed.lifestyle.description}
            </p>
          )}

          <div className="space-y-4">

            {(breed.lifestyle.dailyRoutine || breed.lifestyle.tips || []).map((item, i) => (

              <div
                key={i}
                className="
                  bg-white
                  rounded-[20px]
                  p-5
                  border border-gray-100
                  hover:shadow-lg
                  transition
                "
              >
                <h3 className="font-semibold text-lg">
                  {item}
                </h3>
              </div>

            ))}

          </div>

          {breed.lifestyle.essentials && (

            <div className="mt-8">

              <h3 className="font-bold text-xl mb-4">
                Essentials
              </h3>

              <div className="flex flex-wrap gap-3">

                {breed.lifestyle.essentials.map((item, i) => (

                  <span
                    key={i}
                    className="
                      bg-white
                      border
                      rounded-full
                      px-5 py-2
                      font-semibold
                      text-sm
                      hover:bg-black
                      hover:text-white
                      transition
                    "
                  >
                    {item}
                  </span>

                ))}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  </section>
)}
      
    
      {breed.vetCare && (
        <section className="mt-14 px-6">
          <div className="bg-[#e8f5e9] rounded-[30px] p-10">
            <h2 className="text-4xl font-bold mb-10">{breed.vetCare.title}</h2>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {breed.vetCare.image && (
                <div>
                  <img src={breed.vetCare.image} alt={breed.name} className="w-full rounded-[24px] object-cover" />
                </div>
              )}
              <div className="grid grid-cols-1 gap-6">
                {breed.vetCare.commonIssues && (
                  <div>
                    <h3 className="font-bold text-xl mb-4">Common Issues</h3>
                    <div className="space-y-3">
                      {breed.vetCare.commonIssues.map((item, i) => (
                        <div key={i} className="bg-white rounded-[20px] p-4 border"><p className="font-semibold text-lg">{item}</p></div>
                      ))}
                    </div>
                  </div>
                )}
                {breed.vetCare.preventionTips && (
                  <div>
                    <h3 className="font-bold text-xl mb-4">Prevention Tips</h3>
                    <div className="space-y-3">
                      {breed.vetCare.preventionTips.map((item, i) => (
                        <div key={i} className="bg-white rounded-[20px] p-4 border"><p className="font-semibold text-lg">{item}</p></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      {breed.funFacts && breed.funFacts.length > 0 && (
        <section className="mt-14 px-6">
          <div className="bg-[#fff8e1] rounded-[30px] p-10">
            <h2 className="text-4xl font-bold mb-10">🎉 Fun Facts</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {breed.funFacts.map((fact, i) => (
                <div key={i} className="bg-white border rounded-[20px] p-6 flex gap-4 items-start"><span className="text-2xl mt-1">✨</span><p className="text-gray-700 leading-7 text-lg">{fact}</p></div>
              ))}
            </div>
          </div>
        </section>
      )}
      {breed.faq && breed.faq.length > 0 && <BreedFAQ breed={breed} />}
      {otherBreeds.length > 0 && <BreedSlider breeds={otherBreeds} />}
    </div>
  );
};

export default BreedDetails;