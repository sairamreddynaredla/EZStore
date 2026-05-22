import { Link } from "react-router-dom"

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-[30px] overflow-hidden shadow-md hover:shadow-xl transition duration-300">
      
      {/* BLOG IMAGE */}
      <div className="overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-[250px] object-cover hover:scale-105 transition duration-500"
        />
      </div>

      {/* BLOG CONTENT */}
      <div className="p-6">
        
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
          <span>{blog.category}</span>
          <span>•</span>
          <span>{blog.readTime}</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
          {blog.title}
        </h2>

        <p className="text-gray-600 mb-5 line-clamp-3">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between">
          
          <div className="text-sm text-gray-500">
            <p>{blog.author}</p>
            <p>{blog.date}</p>
          </div>

          <Link
            to={`/blogs/${blog.slug}`}
            className="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition"
          >
            Read More
          </Link>

        </div>
      </div>
    </div>
  )
}

export default BlogCard