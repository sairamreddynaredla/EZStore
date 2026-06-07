import blogs from "../../data/blogs"
import { Link } from "react-router-dom"

const FeaturedBlog = () => {

  const featuredBlog = blogs.find((blog) => blog.featured)

  if (!featuredBlog) return null

  return (
    <div className="mb-14">
      <div className="relative rounded-4xl overflow-hidden h-125">

        <img
          src={featuredBlog.image}
          alt={featuredBlog.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-10 text-white max-w-3xl">

            <span className="bg-orange-500 px-4 py-2 rounded-full text-sm font-medium">
              Featured Blog
            </span>

            <h2 className="text-5xl font-bold mt-5 mb-5 leading-tight">
              {featuredBlog.title}
            </h2>

            <p className="text-lg text-gray-200 mb-6">
              {featuredBlog.excerpt}
            </p>

            <Link
              to={`/blogs/${featuredBlog.slug}`}
              className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              Read Full Article
            </Link>

          </div>
        </div>

      </div>
    </div>
  )
}

export default FeaturedBlog