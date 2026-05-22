import blogs from "../../data/blogs"
import BlogCard from "../blogs/BlogCard"
import { Link } from "react-router-dom"

const BlogSection = () => {
  return (
    <section className="py-20 px-4 bg-[#fffaf5]">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-12">

          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              Latest Blogs
            </h2>

            <p className="text-gray-500">
              Pet care tips and guides for your furry friends.
            </p>
          </div>

          <Link
            to="/blogs"
            className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
          >
            View All
          </Link>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {blogs.slice(0, 3).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}

        </div>

      </div>

    </section>
  )
}

export default BlogSection