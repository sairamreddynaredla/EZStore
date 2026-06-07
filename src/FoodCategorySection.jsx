import { useState } from "react"
import { Link } from "react-router-dom"

// Import images using URL for better asset handling
const catCrunchImg = new URL("../assets/explore-pick-pamper/cat crunch.png", import.meta.url).href
const creamyTreatsImg = new URL("../assets/explore-pick-pamper/creamy treats.png", import.meta.url).href
const dogDentalImg = new URL("../assets/explore-pick-pamper/dog dental treats.png", import.meta.url).href
const dogMeatyImg = new URL("../assets/explore-pick-pamper/dog meaty.png", import.meta.url).href

// Tab definitions
const tabs = ["Food", "Treat"]

// Food sub-categories matching the  design (image 1)
const foodCategories = [
  {
    label: "Wet Food",
    bgColor: "#F5A623",
    labelBg: "#A0522D",
    link: "/collections/wet-food",
    image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600&auto=format&fit=crop&q=80",
    pets: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop",
    ],
  },
  {
    label: "Dry Food",
    bgColor: "#F5A623",
    labelBg: "#C0392B",
    link: "/collections/dog-cat-dry-food",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80",
    pets: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&auto=format&fit=crop",
    ],
  },
  {
    label: "Puppy & Kitten Food",
    bgColor: "#F5A623",
    labelBg: "#C0392B",
    link: "/collections/puppy-kitten-food",
    image: "https://images.unsplash.com/photo-1601758174493-45d0a4d2e2d8?w=600&auto=format&fit=crop&q=80",
    pets: [
      "https://images.unsplash.com/photo-1568572933382-74d440642117?w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=200&auto=format&fit=crop",
    ],
  },
  {
    label: "Prescription Food",
    bgColor: "#F5A623",
    labelBg: "#5B8DB8",
    link: "/collections/prescription-food",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80",
    pets: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop",
    ],
  },
]

// Placeholder content for other tabs (extend as needed)
const treatCategories = [
  { label: "Crunchy Treats", bgColor: "#F5A623", labelBg: "#C0392B", link: "/collections/crunchy-treats", image: catCrunchImg, pets: [] },
  { label: "Creamy Treats", bgColor: "#F5A623", labelBg: "#A0522D", link: "/collections/creamy-treats", image: creamyTreatsImg, pets: [] },
  { label: "Dental Treats", bgColor: "#F5A623", labelBg: "#5B8DB8", link: "/collections/dental-treats", image: dogDentalImg, pets: [] },
  { label: "Meaty Treats", bgColor: "#F5A623", labelBg: "#1A5844", link: "/collections/meaty-treats", image: dogMeatyImg, pets: [] },
]

const tabData = {
  Food: foodCategories,
  Treat: treatCategories,
}

function CategoryCard({ category }) {
  return (
    <Link
      to={category.link}
      className="group relative rounded-2xl overflow-hidden flex flex-col cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      style={{ backgroundColor: category.bgColor }}
    >
      {/* Image area */}
      <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
        <img
          src={category.image}
          alt={category.label}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "https://placehold.co/400x300/F5A623/ffffff?text=Pet+Food"
          }}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
      </div>

      {/* Label bar */}
      <div
        className="flex items-center justify-center py-4 px-3"
        style={{ backgroundColor: category.labelBg }}
      >
        <span className="text-white font-semibold text-base sm:text-lg tracking-wide text-center leading-tight">
          {category.label}
        </span>
      </div>
    </Link>
  )
}

function FoodCategorySection() {
  const [activeTab, setActiveTab] = useState("Food")

  const currentCategories = tabData[activeTab] || []

  return (
    <section className="px-4 sm:px-6 md:px-10 py-16 bg-[#f9f9f9]">

      {/* Header row: title + tab filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Explore. Pick. Pamper.
        </h2>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-semibold text-sm sm:text-base border-2 transition-all duration-200 cursor-pointer
                ${activeTab === tab
                  ? "bg-[#E63946] border-[#E63946] text-white shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:border-[#E63946] hover:text-[#E63946]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>

      {/* Category cards grid */}
      {currentCategories.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {currentCategories.map((cat, idx) => (
            <CategoryCard key={idx} category={cat} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-56 rounded-2xl bg-white border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-lg font-medium">Coming Soon</p>
        </div>
      )}

      {/* View All link */}
      <div className="text-center mt-10">
        <Link
          to="/collections"
          className="inline-block text-[#E63946] font-semibold text-base hover:underline underline-offset-4 transition-all"
        >
          View All →
        </Link>
      </div>

    </section>
  )
}

export default FoodCategorySection
