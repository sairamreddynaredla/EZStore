import { useParams } from "react-router-dom";
import breedData from "../../data/breeds";
import SEO from "../../components/SEO";
import BreedHero from "../../components/breeds/BreedHero";
import BreedInfo from "../../components/breeds/BreedInfo";

const BreedDetails = () => {
  const { slug } = useParams();

  const breed = breedData.find((b) => b.slug === slug);

  if (!breed) {
    return (
      <div className="text-center py-20 text-3xl font-bold text-gray-400">🐾 Breed Not Found</div>
    );
  }

  // BreedInfo expects flat object: {size, lifespan, weight, grooming, summary}
  const infoData = {
    summary:
      breed.summary ||
      breed.description ||
      breed.info?.summary ||
      breed.overview?.summary ||
      `Learn about this breed: size, temperament, grooming and care recommendations.`,
    size: breed.info?.size || breed.overview?.size || "—",
    lifespan: breed.info?.lifespan || breed.overview?.lifespan || "—",
    weight: breed.info?.weight || breed.overview?.weight || "—",
    grooming: breed.info?.grooming || breed.overview?.shedding || breed.info?.shedding || "—",
    summary:
      breed.description ||
      (breed.category
        ? `Learn about the ${breed.name} — a ${breed.category} breed. Find care tips, temperament, and essential product recommendations.`
        : `Learn about the ${breed.name} breed, care, size and recommended products.`),
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-10 px-4 sm:px-6 lg:px-8">
      <SEO
        title={breed.name}
        description={
          breed.description ||
          `Learn about the ${breed.name} breed, care, size and recommended products.`
        }
        image={breed.image}
        keywords={(breed.tags || []).join(", ")}
      />
      <BreedHero breed={breed} />
      <BreedInfo breed={infoData} />
    </div>
  );
};

export default BreedDetails;
