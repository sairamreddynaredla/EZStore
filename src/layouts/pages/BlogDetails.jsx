import { useParams, Link } from "react-router-dom";
import blogs from "../../data/blogs";
import products from "../../data/products";
import ReactMarkdown from "react-markdown";

const BlogDetails = () => {
  const { slug } = useParams();

  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Blog Not Found
      </div>
    );
  }

  return (
    <div className="bg-[#faf7f2] min-h-screen">

      {/* MAIN CONTAINER */}

      <div className="max-w-[1000px] mx-auto px-4 py-10">

        {/* HERO SECTION */}

        <div className="mb-16">

          {/* BACK BUTTON */}

          <Link
            to="/blogs"
            className="text-orange-500 font-semibold hover:text-orange-600"
          >
            ← Back to Blogs
          </Link>

          {/* CATEGORY + INFO */}

          <div className="flex items-center gap-4 flex-wrap mt-8 mb-5">

            <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
              {blog.category}
            </span>

            <span className="text-gray-500 text-sm">
              {blog.readTime}
            </span>

            <span className="text-gray-500 text-sm">
              {blog.date}
            </span>

          </div>

          {/* TITLE */}

          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 max-w-4xl mb-6">
            {blog.title}
          </h1>

          {/* EXCERPT */}

          <p className="text-lg text-gray-600 leading-8 max-w-3xl">
            {blog.excerpt}
          </p>

          {/* AUTHOR */}

          <div className="flex items-center gap-4 mt-8">

            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              alt="author"
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>

              <p className="font-semibold text-gray-800">
                {blog.author}
              </p>

              <p className="text-gray-500 text-sm">
                Pet Care Expert
              </p>

            </div>

          </div>

          {/* HERO IMAGE */}

          <div className="mt-10 rounded-[24px] overflow-hidden">

            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-[520px] object-cover"
            />

          </div>

        </div>

        {/* BLOG CONTENT */}

        <div>

          <div
            className="
            prose prose-lg max-w-none
            prose-p:text-gray-700
            prose-p:leading-8
            prose-p:text-[17px]
            prose-li:text-gray-700
            prose-li:leading-8
            prose-li:text-[17px]
            prose-headings:text-black
            prose-h2:text-3xl
            prose-h2:font-bold
            prose-h2:mt-14
            prose-h2:mb-5
            prose-h3:text-2xl
            prose-h3:font-semibold
            prose-h3:mt-10
            prose-h3:mb-4
            "
          >

            <ReactMarkdown>
              {blog.content}
            </ReactMarkdown>

          </div>

        </div>

        {/* FEATURED PRODUCT */}

        <div className="my-16 bg-white rounded-[24px] border border-gray-100 overflow-hidden">

          <div className="grid md:grid-cols-2 gap-8 items-center">

            <img
              src={products[0]?.image}
              alt={products[0]?.name}
              className="w-full h-[320px] object-cover"
            />

            <div className="p-6 md:p-8">

              <p className="text-orange-500 font-semibold mb-3">
                Featured Product
              </p>

              <h2 className="text-3xl font-bold mb-4">
                {products[0]?.name}
              </h2>

              <p className="text-gray-600 leading-8 mb-6">
                {products[0]?.description?.slice(0, 140)}
              </p>

              <div className="flex items-center justify-between">

                <p className="text-3xl font-bold text-orange-500">
                  ₹{products[0]?.price}
                </p>

                <button className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold transition">
                  Shop Now
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* FAQ SECTION */}

        {blog.faqs && (

          <div className="my-16">

            <h2 className="text-3xl font-bold mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">

              {blog.faqs.map((faq, index) => (

                <div
                  key={index}
                  className="bg-white rounded-[20px] p-6 border border-gray-100"
                >

                  <h3 className="text-xl font-semibold mb-3">
                    {faq.question}
                  </h3>

                  <p className="text-gray-600 leading-7">
                    {faq.answer}
                  </p>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* RELATED BLOGS */}

        <div className="mt-20">

          <div className="flex items-center justify-between mb-10">

            <h2 className="text-3xl font-bold">
              Related Blogs
            </h2>

            <Link
              to="/blogs"
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              View All →
            </Link>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {blogs
              .filter((item) => item.slug !== blog.slug)
              .slice(0, 2)
              .map((item) => (

                <Link
                  to={`/blogs/${item.slug}`}
                  key={item.id}
                  className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300"
                >

                  <div className="overflow-hidden">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[260px] object-cover group-hover:scale-105 transition duration-500"
                    />

                  </div>

                  <div className="p-6">

                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">

                      <span>{item.category}</span>

                      <span>•</span>

                      <span>{item.readTime}</span>

                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 leading-snug mb-3">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 leading-7">
                      {item.excerpt?.slice(0, 100)}
                    </p>

                  </div>

                </Link>

              ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default BlogDetails;