import blogs from "../../data/blogs"
import BlogCard from "../../components/blogs/BlogCard"
import bannerImage from "../../assets/blog-banner/blogs-banner.jpeg"

const Blogs = () => {
  return (
    <div className="bg-[#fdf6ee] min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">

       {/* HERO BANNER */}
<div className="relative overflow-hidden rounded-[40px] h-[420px] mb-16">
  <img
    src={bannerImage}
    alt="blogs-banner"
    className="w-full h-full object-cover object-[center_20%] rounded-[40px]"
  />
</div>

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {["All", "Dogs", "Cats", "Rabbits", "Fish", "Birds", "Hamsters"].map((item) => (
            <button
              key={item}
              className="bg-white shadow-md px-6 py-3 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* BLOG GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default Blogs