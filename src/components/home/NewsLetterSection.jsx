import {
  Mail,
  Send,
  PawPrint,
} from "lucide-react"

const NewsLetterSection = () => {

  return (

    <section className="py-24 bg-[#f8f8f8] overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <div className="relative bg-[#16325B] rounded-[42px] overflow-hidden px-8 md:px-16 py-16 md:py-20">

          {/* BACKGROUND GLOW */}

          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/20 blur-3xl rounded-full"></div>

          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 blur-3xl rounded-full"></div>

          {/* CONTENT */}

          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}

            <div>

              <div className="bg-white/10 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center mb-6">

                <PawPrint
                  size={30}
                  className="text-white"
                />

              </div>

              <p className="text-red-400 uppercase tracking-[4px] font-semibold mb-4">

                Join The Community

              </p>

              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">

                Get Pet Care Tips,
                Offers & Updates

              </h2>

              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">

                Join thousands of pet parents receiving exclusive
                deals, nutrition advice, wellness tips, and premium
                product updates from eZSTORE.

              </p>

            </div>

            {/* RIGHT */}

            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl">

              {/* TOP */}

              <div className="flex items-center gap-4 mb-8">

                <div className="bg-red-100 w-14 h-14 rounded-2xl flex items-center justify-center">

                  <Mail
                    size={26}
                    className="text-red-500"
                  />

                </div>

                <div>

                  <h3 className="text-2xl font-bold text-gray-900">

                    Subscribe Newsletter

                  </h3>

                  <p className="text-gray-500">

                    Stay connected with eZSTORE

                  </p>

                </div>

              </div>

              {/* INPUT */}

              <div className="space-y-5">

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full h-16 px-6 rounded-2xl border border-gray-200 outline-none focus:border-[#16325B] text-lg"
                />

                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full h-16 px-6 rounded-2xl border border-gray-200 outline-none focus:border-[#16325B] text-lg"
                />

                <button className="w-full h-16 bg-red-500 hover:bg-red-600 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3 transition">

                  <Send size={20} />

                  Subscribe Now

                </button>

              </div>

              {/* FOOT TEXT */}

              <p className="text-gray-500 text-sm leading-relaxed mt-6">

                By subscribing, you agree to receive updates,
                promotions, and pet wellness insights from eZSTORE.

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>

  )
}

export default NewsLetterSection