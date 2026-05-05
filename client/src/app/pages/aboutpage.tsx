import { FaLeaf, FaHandshake, FaStar, FaClock } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About BRAVYN</h1>
          <p className="text-xl text-blue-100">
            Where comfort meets bold expression
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl space-y-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to Our Story
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Welcome to BRAVYN, where comfort meets style and individuality
              thrives. Our brand was founded with a simple yet powerful mission:
              to create the perfect clothing for the Gen Z community and beyond.
              We believe in expressing your individuality through fashion that
              is both comfortable and trend-setting.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every piece in our collection is crafted from high-quality, 100%
              premium materials, ensuring a soft feel and a relaxed fit that
              makes you look and feel amazing. We are a passionate, family-owned
              business based in India, and every product is designed with
              passion and meticulous attention to detail.
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-8 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <FaStar className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Premium Quality
                  </h3>
                </div>
                <p className="text-gray-700">
                  We never compromise on quality. Every thread, every seam, and
                  every detail is checked to ensure excellence.
                </p>
              </div>

              <div className="bg-green-50 p-8 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white">
                    <FaLeaf className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Sustainability
                  </h3>
                </div>
                <p className="text-gray-700">
                  We care about the planet. Our production processes are
                  environmentally conscious and ethical.
                </p>
              </div>

              <div className="bg-purple-50 p-8 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white">
                    <FaHandshake className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Community
                  </h3>
                </div>
                <p className="text-gray-700">
                  We build a community where creativity, authenticity, and
                  self-expression thrive together.
                </p>
              </div>

              <div className="bg-orange-50 p-8 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white">
                    <FaClock className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Fast Delivery
                  </h3>
                </div>
                <p className="text-gray-700">
                  Quick and reliable shipping to get your favorites to you as
                  fast as possible.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Join the Movement?
            </h2>
            <p className="text-lg mb-8 text-blue-100">
              Find your vibe and wear it with confidence.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
