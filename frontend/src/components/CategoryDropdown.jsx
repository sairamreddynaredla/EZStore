import { useState } from "react";
// ...existing code...
import { Link } from "react-router-dom";

const foodCategories = [
  {
    name: "Food",
    subcategories: [
      { label: "Dry Food", path: "dry-food" },
      { label: "Wet Food", path: "wet-food" },
      { label: "Puppy Food", path: "puppy-food" },
      { label: "Fresh Food", path: "fresh-food" },
      { label: "Vegetarian Food", path: "vegetarian-food" },
      { label: "Grain Free Food", path: "grain-free-food" },
      { label: "Prescription Food", path: "prescription-food" },
    ],
  },
  {
    name: "Treats & Biscuits",
    subcategories: [
      { label: "Biscuits & Cookies", path: "biscuits-cookies" },
      { label: "Meaty Treats", path: "meaty-treats" },
      { label: "Dental Treats", path: "dental-treats" },
      { label: "Vegetarian Treats", path: "vegetarian-treats" },
      { label: "Puppy Treats", path: "puppy-treats" },
    ],
  },
];

const catFoodCategories = [
  {
    name: "Food",
    subcategories: [
      { label: "Dry Food", path: "dry-food" },
      { label: "Wet Food", path: "wet-food" },
      { label: "Kitten Food", path: "kitten-food" },
      { label: "Prescription Food", path: "prescription-food" },
      { label: "Grain Free Food", path: "grain-free-food" },
    ],
  },
  {
    name: "Treats & Biscuits",
    subcategories: [
      { label: "Meaty Treats", path: "meaty-treats" },
      { label: "Crunchy Treats", path: "crunchy-treats" },
      { label: "Creamy Treats", path: "creamy-treats" },
    ],
  },
];

function CategoryDropdown({ type = "dog", onNavigate }) {
  const [open, setOpen] = useState(false);
  const categories = type === "dog" ? foodCategories : catFoodCategories;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="font-medium transition-all duration-300 px-4 py-2.5 rounded-full whitespace-nowrap text-[#4B5563] hover:text-[#1F6B52] hover:bg-[#F5F5F5] cursor-pointer select-none">
        {type === "dog" ? "Dogs" : "Cats"}
      </span>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-xl p-6 min-w-85 z-50 flex gap-10 border border-gray-200">
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="font-bold text-[#1F6B52] mb-2">{cat.name}</div>
              <ul className="space-y-1">
                {cat.subcategories.map((sub) => (
                  <li key={sub.path}>
                    <Link
                      to={`/${type}s/${sub.path}`}
                      className="block text-[#4B5563] hover:text-[#1F6B52] py-1 px-2 rounded transition"
                      onClick={() => {
                        setOpen(false);
                        if (onNavigate) onNavigate();
                      }}
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;
