// This file was cleaned by scripts/removeBreedFieldsAst.cjs
// Backup created at: scripts\breeds.js.bak.1781594258104

import labradorImg from "../assets/breeds/dogs/labrador.webp";
import cockatiелImg from "../assets/breeds/birds/Cockatiel.webp";
import macawImg from "../assets/breeds/birds/Macaw.webp";

const breedData = [
  {
    id: 1,
    slug: "golden-retriever",
    category: "dog",
    name: "Golden Retriever",
    title: "Meet the Golden Retriever!",
    subtitle: "The Ultimate Companion for Fun & Joy!",
    description:
      "Loyal, loving, and always up for a game of fetch, the Golden Retriever is one of the world's most adored dog breeds. Perfect for families, therapy work, and active homes, Goldens thrive on love, play, and companionship.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVc4VGG8ng6X3JMJXRc9qZOntMdfqOmrI58sluJTpHvA&s",
    traits: ["Intelligent", "Friendly", "Devoted"],
    info: {
      size: "Large",
      lifespan: "10-12 years",
      weight: "50-68lb",
      grooming: "Moderate",
    },
    overview: {
      image: "/breeds/golden-retriever.jpeg",
    },
  },
  {
    id: 2,
    slug: "labrador-retriever",
    category: "dog",
    name: "Labrador Retriever",
    title: "Meet the Labrador Retriever!",
    subtitle: "The Beloved Family Companion!",
    description:
      "Friendly, outgoing, and always ready for adventure, the Labrador Retriever is the world's most popular dog breed. Labs are known for their loyalty, intelligence, and playful spirit—making them perfect for families, service work, and active lifestyles.",
    image: labradorImg,
    traits: ["Gentle", "Loyal", "Playful"],
    info: {
      size: "Large",
      lifespan: "10-12 years",
      weight: "50-72lb",
      grooming: "Moderate",
    },
    overview: {
      image: labradorImg,
    },
  },
  {
    id: 3,
    slug: "german-shepherd",
    category: "dog",
    name: "German Shepherd",
    title: "Meet the German Shepherd!",
    subtitle: "The Loyal Protector & Worker!",
    description:
      "German Shepherds are renowned for their intelligence, courage, and loyalty. These versatile dogs excel as family companions, service animals, and working dogs in police and rescue roles. Their devotion and trainability make them one of the most respected breeds worldwide.",
    image:
      "https://basepaws.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fqj2yxv39d6ig%2F5EZ4FPRFHVdzB8JO3RzjLb%2F577520c420c2c9973fdc689c10bb9437%2FOld_German_Shepherd_1000.jpg&w=1080&q=75",
    traits: ["Confident", "Courageous", "Smart"],
    info: {
      size: "Large",
      lifespan: "9-13 years",
      weight: "60-80lb",
      grooming: "Moderate",
    },
    overview: {
      image: "/breeds/german-shepherd.jpeg",
    },
  },
  {
    id: 4,
    slug: "pomeranian",
    category: "dog",
    name: "Pomeranian",
    title: "Meet the Pomeranian!",
    subtitle: "The Fluffy, Lively Toy Dog!",
    description:
      "Pomeranians are tiny, energetic, and full of personality. With their luxurious coats and alert expressions, Poms are adored as loving companions and make excellent watchdogs. Their intelligence and charm make them a favorite among toy breeds.",
    image:
      "https://headsupfortails.com/cdn/shop/articles/Pomeranian_Dog_Guide_38876a16-d481-41d0-a5d8-4bf26afd2c8f.jpg?v=1754635331",
    traits: ["Cute", "Energetic", "Alert"],
    info: {
      size: "Small",
      lifespan: "12-16 years",
      weight: "3-6lb",
      grooming: "High",
    },
    overview: {
      image: "/breeds/pomeranian.jpeg",
    },
  },
  {
    id: 5,
    slug: "beagle",
    category: "dog",
    name: "Beagle",
    title: "Meet the Beagle!",
    subtitle: "The Merry Scent Hound!",
    description:
      "Beagles are cheerful, intelligent, and energetic dogs known for their excellent sense of smell and friendly nature. Their playful spirit and loving temperament make them wonderful family companions and adventure buddies.",
    image: "https://a-us.storyblok.com/f/1016262/1104x676/e36872ce32/beagle.png",
    traits: ["Curious", "Friendly", "Energetic"],
    info: {
      size: "Medium",
      lifespan: "12-15 years",
      weight: "18-22lb",
      grooming: "Low",
    },
    overview: {
      image: "/breeds/beagle.jpeg",
    },
  },
  {
    id: 6,
    slug: "persian-cat",
    category: "cat",
    name: "Persian Cat",
    title: "Meet the Persian Cat!",
    subtitle: "The Epitome of Feline Elegance",
    description:
      "Gentle, affectionate, and breathtakingly beautiful, Persian Cats are the royalty of the cat world. Their luxurious coats, soulful eyes, and calm personalities make them the perfect companions for those seeking a loving, low-key feline friend.",
    image:
      "https://media.istockphoto.com/id/1263891642/photo/white-persian-cat.jpg?s=612x612&w=0&k=20&c=wM8ZU7KChEodwRlHU7Ijt7c1Pdx0YHwE2Uvgcu46EWA=",
    traits: ["Affectionate", "Calm", "Luxury breed", "Family-friendly", "Beginner-friendly"],
    overview: {
      image: "/breeds/persian-cat.jpeg",
      origin: "Iran (Persia)",
      group: "Longhair",
      lifespan: "12–17 years",
      height: "25–38 cm",
      weight: "6-12lb",
      coat: "Long, silky, dense",
      eyeColor: ["Copper", "Blue", "Green", "Odd-eyed"],
      energyLevel: "Low to moderate",
      affectionLevel: "Very high",
      intelligence: "Moderate",
      childFriendly: true,
      apartmentFriendly: true,
      sheddingLevel: "High",
    },
    personality: {
      family: "Deeply bonds with family, follows favorite humans, loves gentle affection.",
      children: "Patient and tolerant with gentle children.",
      strangers: "Reserved but never aggressive; prefers to observe.",
      otherPets: "Coexists peacefully with calm pets, especially with gradual introduction.",
      emotional: "Sensitive, craves calm and loving environment.",
      indoor: "Enjoys lounging, sunbathing, and being pampered.",
      attention: "Welcomes attention but is never demanding.",
      habits: "Quiet purring, slow blinks, curling up in cozy corners.",
    },
    appearance: {
      face: "Flat, round face with a short nose (brachycephalic)",
      eyes: "Large, round, expressive; copper, blue, green, or odd-eyed",
      coat: "Luxuriously long, dense, and silky",
      tail: "Short, bushy, plume-like",
      body: "Medium, cobby build with sturdy legs",
      ears: "Small, rounded, set wide apart",
      colors: ["White", "Blue", "Black", "Cream", "Golden", "Silver", "Bicolor", "More"],
      unique: "Doll face or peke-face, thick ruff around neck",
      whySpecial:
        "Regal bearing, flowing coat, and soulful eyes create an aura of luxury and tranquility. Each Persian is a living work of art—soft, plush, and endlessly photogenic.",
    },
    health: {
      commonIssues: [
        "Polycystic kidney disease (PKD)",
        "Respiratory issues",
        "Dental disease",
        "Eye problems",
        "Obesity",
      ],
      preventive: "Regular vet checkups, genetic screening, parasite control.",
      vaccination: "Core vaccines are vital for indoor cats.",
      dental: "Brush teeth weekly; provide dental treats.",
      weight: "Monitor portions and encourage play.",
      vetVisits: "At least twice a year for adults; more for kittens/seniors.",
      warningSigns: [
        "Lethargy",
        "Labored breathing",
        "Appetite loss",
        "Excessive tearing",
        "Sudden weight changes",
      ],
    },
    healthDisclaimer:
      "This content is informational and not a substitute for professional veterinary advice.",
    activity: {
      energy: "Calm but playful in short bursts.",
      indoor: "Wand toys, climbing trees, puzzle feeders.",
      play: "10–20 minutes of interactive play daily.",
      mental: "Hide treats, rotate toys, teach tricks.",
      toys: ["Feather wands", "Plush mice", "Tunnels", "Laser pointers"],
      duration: "Short, frequent sessions.",
      obesity: "Encourage movement and avoid free-feeding.",
    },
    environment: {
      apartment: "Excellent; quiet and adaptable.",
      idealHome: "Calm, loving, and safe indoor environment.",
      climate: "Sensitive to heat; keep cool in summer.",
      indoorOutdoor: "Strictly indoor recommended for safety and coat health.",
      family: "Great with gentle families and singles.",
      singleOwner: "Bond deeply with one or more people.",
    },
    families: {
      kids: "Gentle and patient with respectful children.",
      seniors: "Perfect lap cats; low energy suits seniors.",
      firstTime: "Beginner-friendly with proper grooming education.",
      busy: "Fine alone for short periods; appreciate calm routines.",
      otherPets: "Peaceful with other calm pets; slow introductions recommended.",
    },
    prosCons: {
      pros: [
        "Stunning, luxurious appearance",
        "Calm, affectionate temperament",
        "Great for apartments",
        "Quiet and gentle",
        "Good with families and seniors",
        "Adaptable to routines",
      ],
      cons: [
        "High grooming needs",
        "Prone to health issues (PKD, eyes)",
        "Sensitive to heat",
        "Can be expensive to buy/maintain",
        "Not hypoallergenic",
        "Not suited for rough play",
      ],
    },
    seo: {
      title: "Persian Cat Breed Guide: Care, Personality, Grooming & More | Pet Food Store",
      meta: "Discover the Persian Cat—luxurious, affectionate, and perfect for families. Learn about care, grooming, health, nutrition, and why Persians are the world’s most beloved cats.",
      keywords: [
        "Persian Cat",
        "Persian Cat Care",
        "Persian Cat Grooming",
        "Persian Cat Personality",
        "Persian Cat Health",
        "Persian Cat Nutrition",
        "Buy Persian Cat",
      ],
      slug: "/breeds/persian-cat",
      og: "Persian Cats are the epitome of feline elegance—gentle, affectionate, and stunningly beautiful. Explore our complete Persian Cat guide for care, grooming, health, and more.",
    },
    ui: {
      featureTags: [
        "Long-haired",
        "Affectionate",
        "Calm",
        "Family-friendly",
        "Indoor",
        "Luxury breed",
        "Beginner-friendly",
      ],
      searchKeywords: [
        "Persian Cat",
        "Persian Cat care",
        "Persian Cat grooming",
        "Persian Cat health",
        "Persian Cat nutrition",
        "Persian Cat for sale",
        "Persian Cat adoption",
      ],
      statistics: {
        avgLifespan: 15,
        avgWeightKg: 4.5,
        avgHeightCm: 31.5,
      },
    },
    recommendations: {
      grooming: [
        "Wide-tooth comb",
        "Slicker brush",
        "Detangling spray",
        "Tear stain wipes",
        "Cat-safe shampoo",
      ],
      food: ["High-protein dry and wet food", "Kitten and senior formulas", "Dental treats"],
      toys: ["Feather wands", "Plush mice", "Tunnels", "Puzzle feeders"],
      beds: ["Plush cat beds", "Heated pads", "Window perches"],
      litter: ["Low-dust litter", "Covered litter boxes", "Litter mats"],
      supplements: ["Omega-3 oils", "Joint support", "Hairball remedies"],
    },
    adoption: {
      tips: [
        "Check local shelters and breed-specific rescues",
        "Ask about health history and temperament",
      ],
      ethical: [
        "Choose breeders who health-test and socialize kittens",
        "Visit in person and see living conditions",
      ],
      redFlags: ["No health guarantees", "Unwilling to answer questions", "Poor living conditions"],
      questions: [
        "Are parents health-tested for PKD?",
        "What is the kitten’s socialization routine?",
        "What vaccinations have been given?",
      ],
      checklist: [
        "Litter box and litter",
        "Food and water bowls",
        "High-quality kitten food",
        "Grooming tools",
        "Safe toys and scratching post",
        "Vet appointment scheduled",
      ],
    },
    closing:
      "Bringing a Persian Cat into your life means welcoming a gentle, loving soul who will fill your home with beauty and warmth. Their quiet companionship and regal presence make every day special. If you’re ready for a lifelong friend who will cherish your love and care, the Persian Cat is waiting for you. Adopt responsibly, love deeply, and enjoy every precious moment with your Persian companion.",
    imagePrompts: [
      "A fluffy Persian kitten with bright blue eyes, sitting on a soft white blanket, natural daylight, high detail, photorealistic, premium pet photography",
      "A majestic white Persian cat lounging on a velvet sofa, golden sunlight, luxurious fur, elegant home interior, high-resolution",
      "A golden Persian cat with emerald eyes, sitting gracefully on a marble table, soft focus, luxury vibe, modern home",
      "A Persian cat being gently groomed with a wide-tooth comb, close-up, silky fur, calm expression, soft lighting",
      "A Persian cat playing with children and adults in a cozy living room, joyful atmosphere, family interaction, warm tones",
      "A luxury portrait of a Persian cat with a jeweled collar, regal pose, dramatic lighting, studio background, ultra-sharp",
      "A Persian cat chasing a feather toy indoors, playful action, modern apartment, natural light, motion blur",
    ],
  },
  {
    id: 7,
    slug: "shih-tzu",
    category: "dog",
    name: "Shih Tzu",
    image:
      "https://askavet.com/cdn/shop/articles/Malshi_2025__Maltese_Shih_Tzu_Mix_Temperament_Care_Guide_c7811f87-f9d3-43d0-9c3a-d066b8827c81.png?v=1755177044&width=1200",
    heroImage:
      "https://www.borrowmydoggy.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F4ij0poqn%2Fproduction%2Fffc7eaf6c412c44f419323a2963d69851e65c756-500x500.png%3Ffit%3Dmax%26auto%3Dformat&w=1080&q=75",
    traits: ["Affectionate", "Sweet", "Playful"],
    description:
      "Shih Tzus are adorable toy dogs loved for their fluffy coats and affectionate personality.",
    info: {
      size: "Small",
      lifespan: "10-16 years",
      temperament: "Affectionate",
      coat: "Long Silky Coat",
      weight: "8-14lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Shih Tzus apartment friendly?",
        answer: "Yes. They are excellent apartment companion dogs.",
      },
    ],
  },
  {
    id: 7,
    slug: "doberman",
    category: "dog",
    name: "Doberman",
    image: "https://miro.medium.com/v2/resize:fit:1400/0*nvB3-PQ7_8Ki1Orq",
    heroImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkEznQwmpnfptg5amcjT96qR7OBEDDu0Riy49W4iWqXQ&s",
    traits: ["Strong", "Alert", "Loyal"],
    description:
      "Dobermans are intelligent, fearless, and highly loyal guard dogs with a sleek athletic body.",
    info: {
      size: "Large",
      lifespan: "10-13 years",
      temperament: "Alert",
      coat: "Short Coat",
      weight: "60-80lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Dobermans good guard dogs?",
        answer: "Yes. Dobermans are among the best guard dog breeds.",
      },
      {
        question: "Are Dobermans loyal pets?",
        answer: "Yes. They are extremely loyal and protective companions.",
      },
    ],
  },
  {
    id: 8,
    slug: "rottweiler",
    category: "dog",
    name: "Rottweiler",
    image: "https://yumove.co.uk/cdn/shop/files/Rottweiler.jpg?v=1749660103",
    heroImage:
      "https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=1600&auto=format&fit=crop",
    traits: ["Confident", "Powerful", "Protective"],
    description:
      "Rottweilers are confident and courageous dogs known for their strength and protective instincts.",
    info: {
      size: "Large",
      lifespan: "8-10 years",
      temperament: "Protective",
      coat: "Short Double Coat",
      weight: "70-120lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Are Rottweilers protective?",
        answer: "Yes. Rottweilers are naturally protective family dogs.",
      },
    ],
  },
  {
    id: 9,
    slug: "husky",
    category: "dog",
    name: "Siberian Husky",
    image:
      "https://www.dailypaws.com/thmb/B6yWhzGpQZsg3kxMzLn-hvGIF7M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/siberian-husky-100800827-2000-9449ca147e0e4b819bce5189c2411188.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1600&auto=format&fit=crop",
    traits: ["Energetic", "Friendly", "Adventurous"],
    description:
      "Siberian Huskies are energetic working dogs famous for their striking looks and endurance.",
    info: {
      size: "Medium",
      lifespan: "12-14 years",
      temperament: "Friendly",
      coat: "Thick Double Coat",
      weight: "40-54lb",
      shedding: "Heavy",
    },
    faq: [
      {
        question: "Do Huskies need lots of exercise?",
        answer: "Yes. Huskies are highly energetic and require daily physical activity.",
      },
    ],
  },
  {
    id: 10,
    slug: "chihuahua",
    category: "dog",
    name: "Chihuahua",
    image: "https://wrapinfur.com/cdn/shop/articles/chihuahua_dog_2.png?v=1777983984&width=1100",
    heroImage:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop",
    traits: ["Tiny", "Bold", "Alert"],
    description:
      "Chihuahuas are tiny companion dogs known for their bold personality and adorable appearance.",
    info: {
      size: "Small",
      lifespan: "14-17 years",
      temperament: "Alert",
      coat: "Short Coat",
      weight: "2-6lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Chihuahuas good apartment pets?",
        answer: "Yes. Chihuahuas are excellent pets for small homes and apartments.",
      },
    ],
  },
  {
    id: 11,
    slug: "great-dane",
    category: "dog",
    name: "Great Dane",
    image:
      "https://ask.woodgreen.org.uk/media/pages/images/da2353ac62-1743751222/great-dane-900x900-crop.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1600&auto=format&fit=crop",
    traits: ["Gentle", "Huge", "Friendly"],
    description:
      "Great Danes are giant yet gentle dogs known for their calm and affectionate nature.",
    info: {
      size: "Giant",
      lifespan: "7-10 years",
      temperament: "Friendly",
      coat: "Short Coat",
      weight: "90-180lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Are Great Danes gentle dogs?",
        answer: "Yes. Great Danes are famously known as gentle giants.",
      },
    ],
  },
  {
    id: 13,
    slug: "boxer",
    category: "dog",
    name: "Boxer",
    image:
      "https://www.thesprucepets.com/thmb/YwjpUBfdG8mkz2L64CX4-mA8cko=/1539x0/filters:no_upscale():strip_icc()/boxer-dog-breed-1117944-hero-dfe9f67a59ce4ab19ebd274c06b28ad1.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=1600&auto=format&fit=crop",
    traits: ["Playful", "Bright", "Energetic"],
    description: "Boxers are energetic and playful family dogs with a strong and athletic body.",
    info: {
      size: "Medium",
      lifespan: "10-12 years",
      temperament: "Energetic",
      coat: "Short Coat",
      weight: "50-64lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Boxers playful pets?",
        answer: "Yes. Boxers are energetic and playful family companions.",
      },
    ],
  },
  {
    id: 14,
    slug: "dachshund",
    category: "dog",
    name: "Dachshund",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFy0AyBzodU5n2bv9SPhyuX1GHAS3IcJkyyxaYTomdVw&s",
    heroImage:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1600&auto=format&fit=crop",
    traits: ["Curious", "Brave", "Lively"],
    description: "Dachshunds are lovable long-bodied dogs with playful and brave personalities.",
    info: {
      size: "Small",
      lifespan: "12-16 years",
      temperament: "Curious",
      coat: "Smooth Coat",
      weight: "14-30lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Dachshunds good family pets?",
        answer: "Yes. Dachshunds are affectionate and loyal companions.",
      },
    ],
  },
  {
    id: 15,
    slug: "border-collie",
    category: "dog",
    name: "Border Collie",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUloTchY8Fn90R2xM3UVWHhJSHVuKroHayIg&s",
    heroImage:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=1600&auto=format&fit=crop",
    traits: ["Smart", "Active", "Hardworking"],
    description:
      "Border Collies are highly intelligent and energetic working dogs famous for agility and obedience.",
    info: {
      size: "Medium",
      lifespan: "12-15 years",
      temperament: "Intelligent",
      coat: "Double Coat",
      weight: "28-40lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Are Border Collies intelligent?",
        answer: "Yes. Border Collies are considered one of the smartest dog breeds.",
      },
    ],
  },
  {
    id: 16,
    slug: "cocker-spaniel",
    category: "dog",
    name: "Cocker Spaniel",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsUUtSvVqpgb_P64YzvTg3uOLupRb8JIb5oA&s",
    heroImage:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=1600&auto=format&fit=crop",
    traits: ["Gentle", "Sweet", "Happy"],
    description:
      "Cocker Spaniels are cheerful and affectionate dogs loved for their silky coats and friendly personality.",
    info: {
      size: "Medium",
      lifespan: "12-15 years",
      temperament: "Gentle",
      coat: "Silky Coat",
      weight: "24-32lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Are Cocker Spaniels family dogs?",
        answer: "Yes. They are affectionate and excellent family companions.",
      },
    ],
  },
  {
    id: 17,
    slug: "pitbull",
    category: "dog",
    name: "Pitbull",
    image:
      "https://cdn.shopify.com/s/files/1/1638/5471/files/when-do-pitbulls-stop-growing-03_480x480.jpg?v=1681374652",
    heroImage:
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=1600&auto=format&fit=crop",
    traits: ["Strong", "Loyal", "Protective"],
    description:
      "Pitbulls are muscular and loyal dogs known for their confidence and affectionate nature.",
    info: {
      size: "Medium",
      lifespan: "12-14 years",
      temperament: "Loyal",
      coat: "Short Coat",
      weight: "32-60lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Pitbulls loyal dogs?",
        answer: "Yes. Pitbulls are highly loyal and affectionate companions.",
      },
    ],
  },
  {
    id: 18,
    slug: "saint-bernard",
    category: "dog",
    name: "Saint Bernard",
    image:
      "https://cdn.britannica.com/68/235668-050-A8F37B6D/Saint-bernard-dog-st-bernard-standing-short-haired.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1600&auto=format&fit=crop",
    traits: ["Calm", "Massive", "Friendly"],
    description:
      "Saint Bernards are giant gentle dogs famous for their calm temperament and rescue history.",
    info: {
      size: "Giant",
      lifespan: "8-10 years",
      temperament: "Friendly",
      coat: "Thick Coat",
      weight: "110-180lb",
      shedding: "Heavy",
    },
    faq: [
      {
        question: "Are Saint Bernards gentle dogs?",
        answer: "Yes. Saint Bernards are calm and affectionate giant dogs.",
      },
    ],
  },
  {
    id: 19,
    slug: "dalmatian",
    category: "dog",
    name: "Dalmatian",
    image:
      "https://www.purina.co.uk/sites/default/files/styles/square_medium_440x440/public/2022-07/Dalmatian.jpg?itok=yjYglscr",
    heroImage:
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1600&auto=format&fit=crop",
    traits: ["Spotted", "Energetic", "Smart"],
    description: "Dalmatians are energetic spotted dogs known for intelligence and elegance.",
    info: {
      size: "Medium",
      lifespan: "11-13 years",
      temperament: "Energetic",
      coat: "Short Coat",
      weight: "40-64lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Are Dalmatians energetic pets?",
        answer: "Yes. Dalmatians are highly energetic and playful dogs.",
      },
    ],
  },
  {
    id: 22,
    slug: "siamese-cat",
    category: "cat",
    name: "Siamese Cat",
    image: "https://baileyscbd.com/cdn/shop/articles/Image_of_a_Siamese_Cat_2044x.png?v=1757697530",
    heroImage:
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=1600&auto=format&fit=crop",
    traits: ["Talkative", "Elegant", "Smart"],
    description:
      "Siamese Cats are intelligent, social, and vocal cats known for their striking blue eyes.",
    info: {
      size: "Medium",
      lifespan: "12-20 years",
      temperament: "Social",
      coat: "Short Fine Coat",
      weight: "6-12lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Siamese Cats vocal?",
        answer: "Yes. Siamese Cats are known for being very talkative.",
      },
      {
        question: "Do Siamese Cats like attention?",
        answer: "Yes. They are social cats that enjoy human interaction.",
      },
    ],
  },
  {
    id: 23,
    slug: "maine-coon",
    category: "cat",
    name: "Maine Coon",
    image: "https://i.pinimg.com/474x/e8/a5/05/e8a505ee4bf1f54d29bed2c9c0af1533.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1600&auto=format&fit=crop",
    traits: ["Large", "Friendly", "Gentle"],
    description:
      "Maine Coons are large, affectionate cats famous for their fluffy coats and friendly nature.",
    info: {
      size: "Large",
      lifespan: "10-15 years",
      temperament: "Gentle",
      coat: "Long Thick Coat",
      weight: "10-18lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Are Maine Coons friendly?",
        answer: "Yes. Maine Coons are gentle and affectionate family cats.",
      },
      {
        question: "Do Maine Coons grow large?",
        answer: "Yes. They are one of the largest domestic cat breeds.",
      },
    ],
  },
  {
    id: 24,
    slug: "british-shorthair",
    category: "cat",
    name: "British Shorthair",
    image:
      "https://happypetproduction.s3.ap-south-1.amazonaws.com/images/20880/regal-british-shorthair-sit.webp",
    heroImage:
      "https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=1600&auto=format&fit=crop",
    traits: ["Quiet", "Cute", "Independent"],
    description:
      "British Shorthairs are calm, easygoing cats with adorable round faces and plush coats.",
    info: {
      size: "Medium",
      lifespan: "12-20 years",
      temperament: "Calm",
      coat: "Dense Plush Coat",
      weight: "8-16lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Are British Shorthairs calm pets?",
        answer: "Yes. They are calm and independent companion cats.",
      },
      {
        question: "Do British Shorthairs require much grooming?",
        answer: "No. Their coat is relatively easy to maintain.",
      },
    ],
  },
  {
    id: 25,
    slug: "ragdoll",
    category: "cat",
    name: "Ragdoll",
    image: "https://d3544la1u8djza.cloudfront.net/APHI/Blog/2023/resources/Ragdoll.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1600&auto=format&fit=crop",
    traits: ["Soft", "Affectionate", "Relaxed"],
    description:
      "Ragdolls are affectionate indoor cats known for their calm temperament and silky coats.",
    info: {
      size: "Large",
      lifespan: "12-17 years",
      temperament: "Relaxed",
      coat: "Silky Medium Coat",
      weight: "8-18lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Are Ragdolls affectionate cats?",
        answer: "Yes. Ragdolls are known for their loving and relaxed personalities.",
      },
      {
        question: "Are Ragdolls good indoor pets?",
        answer: "Yes. They are excellent indoor companion cats.",
      },
    ],
  },
  {
    id: 26,
    slug: "bengal-cat",
    category: "cat",
    name: "Bengal Cat",
    image:
      "https://amarpet.com/_next/image?url=https%3A%2F%2Fapn081-amarpet-prod.sgp1.cdn.digitaloceanspaces.com%2Ffec8d47d412bcbeece3d9128ae855a7a%2Fz6wFlCLnHWgVIk2jz7XWCBEOL1emLw-metaQmVuZ2FsIGNhdCBDYXQgYnJlZWQgKDEpLnBuZw%3D%3D-.png&w=3840&q=75",
    heroImage:
      "https://images.unsplash.com/photo-1503777119540-ce54b422baff?q=80&w=1600&auto=format&fit=crop",
    traits: ["Wild", "Energetic", "Athletic"],
    description:
      "Bengal Cats are energetic, intelligent, and exotic-looking cats with leopard-like spotted coats.",
    info: {
      size: "Medium",
      lifespan: "12-16 years",
      temperament: "Active",
      coat: "Short Spotted Coat",
      weight: "8-14lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Bengal Cats energetic?",
        answer: "Yes. Bengal Cats are highly active and playful pets.",
      },
      {
        question: "Do Bengal Cats look wild?",
        answer: "Yes. Their spotted coats resemble miniature leopards.",
      },
    ],
  },
  {
    id: 27,
    slug: "russian-blue",
    category: "cat",
    name: "Russian Blue",
    image:
      "https://cdn.mos.cms.futurecdn.net/v2/t:0,l:420,cw:1080,ch:1080,q:80,w:1080/KJfnj7HYdEbABNAPE7gM8h.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=1600&auto=format&fit=crop",
    traits: ["Quiet", "Elegant", "Gentle"],
    description:
      "Russian Blue cats are graceful, quiet, and affectionate companions with striking blue-gray coats.",
    info: {
      size: "Medium",
      lifespan: "15-20 years",
      temperament: "Gentle",
      coat: "Short Plush Coat",
      weight: "6-12lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Russian Blue cats quiet?",
        answer: "Yes. They are calm and gentle companion cats.",
      },
      {
        question: "Do Russian Blue cats shed heavily?",
        answer: "No. They are relatively low-shedding cats.",
      },
    ],
  },
  {
    id: 28,
    slug: "sphynx",
    category: "cat",
    name: "Sphynx",
    image:
      "https://www.dailypaws.com/thmb/MIy8Zi-1K9e1rf3ljDtfe6YPonc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/sphynx-bed-sun-528925876-2000-2fff5a8158874c3db7154845e400430f.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?q=80&w=1600&auto=format&fit=crop",
    traits: ["Hairless", "Friendly", "Playful"],
    description:
      "Sphynx cats are affectionate, energetic, and famous for their unique hairless appearance.",
    info: {
      size: "Medium",
      lifespan: "8-14 years",
      temperament: "Friendly",
      coat: "Hairless",
      weight: "6-12lb",
      shedding: "Very Low",
    },
    faq: [
      {
        question: "Are Sphynx cats hairless?",
        answer: "Yes. Sphynx cats are known for their nearly hairless bodies.",
      },
      {
        question: "Do Sphynx cats need baths?",
        answer: "Yes. Their skin requires regular cleaning and baths.",
      },
    ],
  },
  {
    id: 29,
    slug: "parrot",
    category: "bird",
    name: "Parrot",
    image:
      "https://cdn.shopify.com/s/files/1/0565/8021/0861/files/indian-ringneck-parrot.jpg?v=1747129469",
    heroImage:
      "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?q=80&w=1600&auto=format&fit=crop",
    traits: ["Colorful", "Smart", "Talkative"],
    description:
      "Parrots are colorful and intelligent birds known for their playful nature and talking ability.",
    info: {
      size: "Medium",
      lifespan: "15-60 years",
      temperament: "Social",
      coat: "Colorful Feathers",
      weight: "0.2-2lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Can parrots talk?",
        answer: "Yes. Many parrots can mimic human speech and sounds.",
      },
      {
        question: "Are parrots social pets?",
        answer: "Yes. Parrots enjoy interaction and companionship.",
      },
    ],
  },
  {
    id: 30,
    slug: "macaw",
    category: "bird",
    name: "Macaw",
    image: macawImg,
    heroImage:
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?q=80&w=1600&auto=format&fit=crop",
    traits: ["Large", "Intelligent", "Bright"],
    description:
      "Macaws are vibrant, intelligent parrots famous for their beautiful feathers and strong personalities.",
    info: {
      size: "Large",
      lifespan: "30-50 years",
      temperament: "Energetic",
      coat: "Bright Feathers",
      weight: "2-3lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Macaws intelligent birds?",
        answer: "Yes. Macaws are among the smartest bird species.",
      },
      {
        question: "Do Macaws live long?",
        answer: "Yes. Macaws can live for several decades.",
      },
    ],
  },
  {
    id: 31,
    slug: "cockatiel",
    category: "bird",
    name: "Cockatiel",
    image: cockatiелImg,
    heroImage:
      "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=1600&auto=format&fit=crop",
    traits: ["Friendly", "Cute", "Social"],
    description:
      "Cockatiels are affectionate pet birds known for their whistles, friendly behavior, and adorable crests.",
    info: {
      size: "Small",
      lifespan: "15-25 years",
      temperament: "Friendly",
      coat: "Soft Feathers",
      weight: "0.2-0.2lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Cockatiels beginner-friendly birds?",
        answer: "Yes. Cockatiels are one of the best birds for beginners.",
      },
      {
        question: "Do Cockatiels enjoy human interaction?",
        answer: "Yes. They are social birds that enjoy companionship.",
      },
    ],
  },
  {
    id: 32,
    slug: "budgie",
    category: "bird",
    name: "Budgie",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLSXA_AlwPBQyAVjL1INTmJbpapwd3EyaKhQ&s",
    heroImage:
      "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?q=80&w=1600&auto=format&fit=crop",
    traits: ["Tiny", "Playful", "Active"],
    description:
      "Budgies are small, colorful birds known for their playful personality and friendly behavior.",
    info: {
      size: "Small",
      lifespan: "5-10 years",
      temperament: "Friendly",
      coat: "Soft Colorful Feathers",
      weight: "0.1-0.1lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Budgies beginner friendly?",
        answer: "Yes. Budgies are excellent birds for beginners.",
      },
      {
        question: "Can Budgies learn sounds?",
        answer: "Yes. Budgies can mimic sounds and simple words.",
      },
    ],
  },
  {
    id: 33,
    slug: "lovebird",
    category: "bird",
    name: "Lovebird",
    image:
      "https://www.petassure.com/petassure/custom-file-streams/page/3AbByWOQswDELrHr00N5A0loveable-lovebirds.jpg.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1520808663317-647b476a81b9?q=80&w=1600&auto=format&fit=crop",
    traits: ["Affectionate", "Colorful", "Social"],
    description:
      "Lovebirds are affectionate and energetic birds famous for their colorful feathers and bonding nature.",
    info: {
      size: "Small",
      lifespan: "10-15 years",
      temperament: "Social",
      coat: "Bright Feathers",
      weight: "0.1-0.1lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Lovebirds social pets?",
        answer: "Yes. Lovebirds enjoy companionship and interaction.",
      },
      {
        question: "Do Lovebirds need toys?",
        answer: "Yes. Toys help keep them active and mentally stimulated.",
      },
    ],
  },
  {
    id: 34,
    slug: "canary",
    category: "bird",
    name: "Canary",
    image:
      "https://www.shutterstock.com/image-photo/canarie-canary-yellow-small-vibrant-600nw-2630767857.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=1600&auto=format&fit=crop",
    traits: ["Bright", "Musical", "Tiny"],
    description:
      "Canaries are cheerful singing birds admired for their beautiful melodies and vibrant colors.",
    info: {
      size: "Small",
      lifespan: "8-12 years",
      temperament: "Gentle",
      coat: "Soft Yellow Feathers",
      weight: "0lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Canaries known for singing?",
        answer: "Yes. Canaries are famous for their melodious songs.",
      },
      {
        question: "Are Canaries beginner-friendly?",
        answer: "Yes. They are easy birds to care for.",
      },
    ],
  },
  {
    id: 35,
    slug: "finch",
    category: "bird",
    name: "Finch",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwZD5FrcLY_Q1d9joLp1y8I1B3DvFy4PgdvQ&s",
    heroImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop",
    traits: ["Tiny", "Fast", "Colorful"],
    description:
      "Finches are active and colorful birds loved for their cheerful chirping and lively movements.",
    info: {
      size: "Small",
      lifespan: "5-10 years",
      temperament: "Active",
      coat: "Colorful Feathers",
      weight: "0-0.1lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Do Finches enjoy company?",
        answer: "Yes. Finches are happiest in groups or pairs.",
      },
      {
        question: "Are Finches active birds?",
        answer: "Yes. They are energetic and playful birds.",
      },
    ],
  },
  {
    id: 36,
    slug: "african-grey",
    category: "bird",
    name: "African Grey Parrot",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1w0LIsqZoB7TQ5usvYDF30hbAPctHxAvig&s",
    heroImage:
      "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?q=80&w=1600&auto=format&fit=crop",
    traits: ["Intelligent", "Talkative", "Loyal"],
    description:
      "African Grey Parrots are highly intelligent birds known for their speech and emotional bonding.",
    info: {
      size: "Medium",
      lifespan: "40-60 years",
      temperament: "Intelligent",
      coat: "Grey Feathers",
      weight: "0.8-1.2lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Can African Grey parrots talk?",
        answer: "Yes. They are among the best talking birds.",
      },
      {
        question: "Are African Greys intelligent?",
        answer: "Yes. They are extremely intelligent and emotional birds.",
      },
    ],
  },
  {
    id: 37,
    slug: "sun-conure",
    category: "bird",
    name: "Sun Conure",
    image:
      "https://pet-health-content-media.chewy.com/wp-content/uploads/2025/04/16194349/202503bec-202307sun-conure-1024x616.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?q=80&w=1600&auto=format&fit=crop",
    traits: ["Bright", "Energetic", "Loud"],
    description:
      "Sun Conures are vibrant parrots loved for their colorful feathers and playful personality.",
    info: {
      size: "Medium",
      lifespan: "15-30 years",
      temperament: "Playful",
      coat: "Bright Orange Feathers",
      weight: "0.2-0.3lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Sun Conures noisy?",
        answer: "Yes. They are loud and energetic companion birds.",
      },
      {
        question: "Do Sun Conures enjoy attention?",
        answer: "Yes. They love social interaction and bonding.",
      },
    ],
  },
  {
    id: 38,
    slug: "cockatoo",
    category: "bird",
    name: "Cockatoo",
    image:
      "https://www.billabongsanctuary.com.au/wp-content/uploads/2023/07/Sulphur-Crested-Cockatoo-2-800x1200.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1501706362039-c6e80948bb91?q=80&w=1600&auto=format&fit=crop",
    traits: ["Affectionate", "Smart", "Loyal"],
    description:
      "Cockatoos are affectionate birds famous for their intelligence and expressive crests.",
    info: {
      size: "Large",
      lifespan: "40-70 years",
      temperament: "Affectionate",
      coat: "Soft White Feathers",
      weight: "0.6-2lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Are Cockatoos affectionate birds?",
        answer: "Yes. Cockatoos form strong bonds with owners.",
      },
      {
        question: "Do Cockatoos need attention?",
        answer: "Yes. They require regular interaction and stimulation.",
      },
    ],
  },
  {
    id: 39,
    slug: "owl",
    category: "bird",
    name: "Owl",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8TKpogovs1VcAXE31T8hVIfB1s5ZlKYdyOQ&s",
    heroImage:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1600&auto=format&fit=crop",
    traits: ["Nocturnal", "Wise", "Silent"],
    description:
      "Owls are mysterious nocturnal birds admired for their sharp vision and silent flight.",
    info: {
      size: "Medium",
      lifespan: "10-25 years",
      temperament: "Independent",
      coat: "Soft Feathers",
      weight: "1-4lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Owls nocturnal birds?",
        answer: "Yes. Owls are mostly active during the night.",
      },
      {
        question: "Do Owls fly silently?",
        answer: "Yes. Their feathers help them fly almost silently.",
      },
    ],
  },
  {
    id: 33,
    slug: "holland-lop",
    category: "rabbit",
    name: "Holland Lop",
    image:
      "https://img1.wsimg.com/isteam/ip/1e359bb4-cabe-4e03-bd77-8db8ba90a350/ols/Petland_Texas_Rabbit.jpg/:/rs=w:1200,h:1200",
    heroImage:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1600&auto=format&fit=crop",
    traits: ["Cute", "Friendly", "Calm"],
    description:
      "Holland Lop rabbits are adorable small rabbits known for their floppy ears and friendly personality.",
    info: {
      size: "Small",
      lifespan: "7-12 years",
      temperament: "Gentle",
      coat: "Soft Fur",
      weight: "2-4lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Are Holland Lop rabbits friendly?",
        answer: "Yes. They are affectionate and gentle pets.",
      },
      {
        question: "Do Holland Lop rabbits need grooming?",
        answer: "Yes. Weekly brushing helps maintain healthy fur.",
      },
    ],
  },
  {
    id: 34,
    slug: "lionhead-rabbit",
    category: "rabbit",
    name: "Lionhead Rabbit",
    image: "https://a-z-animals.com/media/2022/01/1280px-Rabbit_-_Lionhead_breed.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1583301286816-f4f05e1e8b25?q=80&w=1600&auto=format&fit=crop",
    traits: ["Fluffy", "Playful", "Small"],
    description:
      "Lionhead Rabbits are fluffy companion rabbits famous for their mane-like fur around the head.",
    info: {
      size: "Small",
      lifespan: "8-10 years",
      temperament: "Playful",
      coat: "Long Fluffy Fur",
      weight: "2-3lb",
      shedding: "Moderate",
    },
    faq: [
      {
        question: "Do Lionhead Rabbits have fluffy fur?",
        answer: "Yes. They are known for their mane-like fluffy coat.",
      },
      {
        question: "Are Lionhead Rabbits playful?",
        answer: "Yes. They are energetic and social rabbits.",
      },
    ],
  },
  {
    id: 35,
    slug: "mini-rex",
    category: "rabbit",
    name: "Mini Rex",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1600&auto=format&fit=crop",
    traits: ["Velvety", "Friendly", "Compact"],
    description: "Mini Rex rabbits are loved for their soft velvety fur and calm personalities.",
    info: {
      size: "Small",
      lifespan: "8-12 years",
      temperament: "Friendly",
      coat: "Velvet Fur",
      weight: "3-4lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Mini Rex rabbits soft?",
        answer: "Yes. They are famous for their velvety fur texture.",
      },
      {
        question: "Are Mini Rex rabbits beginner friendly?",
        answer: "Yes. They are calm and easy to care for.",
      },
    ],
  },
  {
    id: 36,
    slug: "netherland-dwarf",
    category: "rabbit",
    name: "Netherland Dwarf",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY7o8G8YrHy_wnlEPWDnorR3n9Q-mLrOFWkw&s",
    heroImage:
      "https://images.unsplash.com/photo-1535241749838-299277b6305f?q=80&w=1600&auto=format&fit=crop",
    traits: ["Tiny", "Energetic", "Cute"],
    description:
      "Netherland Dwarf rabbits are tiny adorable pets with playful and energetic personalities.",
    info: {
      size: "Tiny",
      lifespan: "10-12 years",
      temperament: "Energetic",
      coat: "Short Soft Fur",
      weight: "1-2lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Netherland Dwarf rabbits very small?",
        answer: "Yes. They are among the smallest rabbit breeds.",
      },
      {
        question: "Are Netherland Dwarfs playful?",
        answer: "Yes. They are active and energetic pets.",
      },
    ],
  },
  {
    id: 37,
    slug: "english-angora",
    category: "rabbit",
    name: "English Angora",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Joey_Giant_Angora_Buck.jpg/330px-Joey_Giant_Angora_Buck.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1583301286816-f4f05e1e8b25?q=80&w=1600&auto=format&fit=crop",
    traits: ["Fluffy", "Gentle", "Elegant"],
    description:
      "English Angora rabbits are luxurious fluffy rabbits admired for their wool-like fur.",
    info: {
      size: "Medium",
      lifespan: "7-12 years",
      temperament: "Gentle",
      coat: "Long Wool Fur",
      weight: "4-6lb",
      shedding: "High",
    },
    faq: [
      {
        question: "Are English Angoras fluffy?",
        answer: "Yes. They are famous for their wool-like fluffy fur.",
      },
      {
        question: "Do Angora rabbits need daily grooming?",
        answer: "Yes. Their long fur requires frequent grooming.",
      },
    ],
  },
  {
    id: 35,
    slug: "goldfish",
    category: "fish",
    name: "Goldfish",
    image:
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1600&auto=format&fit=crop",
    traits: ["Peaceful", "Colorful", "Easy Care"],
    description:
      "Goldfish are peaceful freshwater fish loved for their bright colors and beginner-friendly care.",
    info: {
      size: "Small-Medium",
      lifespan: "10-15 years",
      temperament: "Peaceful",
      coat: "Golden Scales",
      weight: "0.2-0.6lb",
      shedding: "None",
    },
    faq: [
      {
        question: "Are Goldfish beginner friendly?",
        answer: "Yes. Goldfish are one of the easiest pet fish to care for.",
      },
      {
        question: "Do Goldfish need large tanks?",
        answer: "Yes. Goldfish grow large and need spacious aquariums.",
      },
    ],
  },
  {
    id: 36,
    slug: "betta-fish",
    category: "fish",
    name: "Betta Fish",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuJSfpK2eKm2ooASXDrkRQzWbdE_jkrq0rGw&s",
    heroImage:
      "https://images.unsplash.com/photo-1520301255226-bf5f144451c1?q=80&w=1600&auto=format&fit=crop",
    traits: ["Beautiful", "Aggressive", "Vibrant"],
    description:
      "Betta Fish are vibrant freshwater fish famous for their flowing fins and bold personalities.",
    info: {
      size: "Small",
      lifespan: "3-5 years",
      temperament: "Aggressive",
      coat: "Colorful Fins",
      weight: "0lb",
      shedding: "None",
    },
    faq: [
      {
        question: "Are Betta Fish aggressive?",
        answer: "Yes. Male Bettas can be territorial and aggressive.",
      },
      {
        question: "Do Betta Fish need heaters?",
        answer: "Yes. Bettas prefer warm tropical water.",
      },
    ],
  },
  {
    id: 37,
    slug: "guppy",
    category: "fish",
    name: "Guppy",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlvSthhWJIzLAtzim1SfkjvvpL3ScJEd7CkA&s",
    heroImage:
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1600&auto=format&fit=crop",
    traits: ["Tiny", "Active", "Colorful"],
    description:
      "Guppies are colorful freshwater fish loved for their lively swimming and easy maintenance.",
    info: {
      size: "Small",
      lifespan: "2-3 years",
      temperament: "Peaceful",
      coat: "Bright Tail Fins",
      weight: "0lb",
      shedding: "None",
    },
    faq: [
      {
        question: "Are Guppies beginner friendly?",
        answer: "Yes. Guppies are easy to care for and very colorful.",
      },
      {
        question: "Do Guppies live in groups?",
        answer: "Yes. They are social schooling fish.",
      },
    ],
  },
  {
    id: 39,
    slug: "koi-fish",
    category: "fish",
    name: "Koi Fish",
    image: "https://a-z-animals.com/media/2021/09/Koi-header.jpg",
    heroImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
    traits: ["Large", "Peaceful", "Colorful"],
    description:
      "Koi Fish are ornamental pond fish admired for their beautiful patterns and calm behavior.",
    info: {
      size: "Large",
      lifespan: "20-40 years",
      temperament: "Peaceful",
      coat: "Patterned Scales",
      weight: "4-28lb",
      shedding: "None",
    },
    faq: [
      {
        question: "Do Koi Fish live long?",
        answer: "Yes. Koi Fish can live for decades with proper care.",
      },
      {
        question: "Are Koi Fish pond fish?",
        answer: "Yes. They are commonly kept in outdoor ponds.",
      },
    ],
  },
  {
    id: 37,
    slug: "syrian-hamster",
    category: "hamster",
    name: "Syrian Hamster",
    image:
      "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=1600&auto=format&fit=crop",
    traits: ["Tiny", "Cute", "Active"],
    description:
      "Syrian Hamsters are adorable small pets known for their friendly nature and playful personality.",
    info: {
      size: "Small",
      lifespan: "2-3 years",
      temperament: "Friendly",
      coat: "Soft Fur",
      weight: "0.2-0.4lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Syrian Hamsters beginner friendly?",
        answer: "Yes. Syrian Hamsters are easy pets for beginners.",
      },
      {
        question: "Do Syrian Hamsters need exercise wheels?",
        answer: "Yes. Exercise wheels help keep them active and healthy.",
      },
    ],
  },
  {
    id: 38,
    slug: "dwarf-hamster",
    category: "hamster",
    name: "Dwarf Hamster",
    image:
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=1200&auto=format&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=1600&auto=format&fit=crop",
    traits: ["Small", "Fast", "Adorable"],
    description:
      "Dwarf Hamsters are tiny energetic pets loved for their fast movements and cute appearance.",
    info: {
      size: "Tiny",
      lifespan: "1.5-3 years",
      temperament: "Energetic",
      coat: "Short Soft Fur",
      weight: "0.1-0.1lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Dwarf Hamsters very small?",
        answer: "Yes. They are much smaller than Syrian Hamsters.",
      },
      {
        question: "Do Dwarf Hamsters run a lot?",
        answer: "Yes. They are energetic pets that love running and playing.",
      },
    ],
  },
  {
    id: 39,
    slug: "roborovski-hamster",
    category: "hamster",
    name: "Roborovski Hamster",
    image:
      "https://supertails.com/cdn/shop/articles/360_f_997846502_dmcp4uwxes45ralz4f5uwmjdhty0tbhq_e21982a8-dd8d-4521-8608-03e910efc6f6.jpg?v=1747032058",
    heroImage:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1600&auto=format&fit=crop",
    traits: ["Fast", "Tiny", "Energetic"],
    description:
      "Roborovski Hamsters are the smallest and fastest hamster breeds with playful personalities.",
    info: {
      size: "Tiny",
      lifespan: "3-3.5 years",
      temperament: "Active",
      coat: "Soft Sandy Fur",
      weight: "0-0.1lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Roborovski Hamsters fast?",
        answer: "Yes. They are one of the fastest hamster breeds.",
      },
      {
        question: "Are Roborovski Hamsters tiny?",
        answer: "Yes. They are the smallest pet hamster breed.",
      },
    ],
  },
  {
    id: 40,
    slug: "chinese-hamster",
    category: "hamster",
    name: "Chinese Hamster",
    image:
      "https://media.licdn.com/dms/image/v2/D4E22AQGgtjuwqUPEkA/feedshare-shrink_800/feedshare-shrink_800/0/1697023318642?e=2147483647&v=beta&t=-lnQMjSbGAc_eHm5RirMDJtQqXIHOXzxHYImeTUsyKQ",
    heroImage:
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=1600&auto=format&fit=crop",
    traits: ["Slim", "Gentle", "Quiet"],
    description:
      "Chinese Hamsters are slender and calm pets known for their quiet behavior and curiosity.",
    info: {
      size: "Small",
      lifespan: "2-3 years",
      temperament: "Gentle",
      coat: "Brown Soft Fur",
      weight: "0.1-0.1lb",
      shedding: "Low",
    },
    faq: [
      {
        question: "Are Chinese Hamsters calm pets?",
        answer: "Yes. They are gentle and quiet companion pets.",
      },
      {
        question: "Do Chinese Hamsters need exercise?",
        answer: "Yes. Exercise wheels are important for their activity.",
      },
    ],
  },
];

export default breedData;
