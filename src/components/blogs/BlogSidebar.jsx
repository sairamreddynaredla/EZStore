const categories = [
  "All",
  "Dogs",
  "Cats",
  "Fish",
  "Birds",
  "Rabbits",
  "Small Pets"
]

const BlogSidebar = () => {

  return (

    <div className="bg-white border border-gray-200 rounded-3xl p-6 sticky top-24">

      <h3 className="text-2xl font-bold mb-6">
        Blog Categories
      </h3>

      <div className="flex flex-col gap-3">

        {categories.map((category) => (

          <button
            key={category}
            className="text-left px-4 py-3 rounded-2xl border border-gray-200 hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            {category}
          </button>

        ))}

      </div>

      <div className="mt-10">

        <h4 className="text-xl font-semibold mb-4">
          Popular Topics
        </h4>

        <div className="flex flex-wrap gap-3">

          <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm">
            Dog Food
          </span>

          <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm">
            Grooming
          </span>

          <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm">
            Fish Care
          </span>

          <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm">
            Pet Health
          </span>

          <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm">
            Training
          </span>

        </div>

      </div>

    </div>

  )
}

export default BlogSidebar