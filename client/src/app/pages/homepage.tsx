import ProductGrid from "../../components/productgrid";
import story from "../../story.png";
import { FaArrowRight, FaShoppingBag, FaWhatsapp } from "react-icons/fa";

const HomePage = () => {
  return (
    <>
      <section
        className="relative h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
        style={{ backgroundImage: "url(/home__back.png)" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fadeInUp">
              Be Bold.
              <br />
              Be Bravyn
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 animate-fadeInUp animation-delay-200">
              Designed for those who lead.
            </p>
            <a
              href="#products-grid"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg animate-fadeInUp animation-delay-400"
            >
              Shop Now
              <FaArrowRight className="text-lg" />
            </a>
          </div>
        </div>
      </section>

      <div id="products-grid" className="py-16 md:py-24">
        <ProductGrid />
      </div>

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center lg:gap-16">
            <div className="order-1 md:order-none">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl transform translate-x-4 translate-y-4 opacity-10"></div>
                <img
                  src={story}
                  alt="Our Story"
                  className="relative w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>

            <div className="order-2 md:order-none">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Our Story
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                When you wear BRAVYN, you're not just wearing clothes—you're
                becoming part of a movement. A movement of people who understand
                that life is not a destination but a series of moments to be
                lived fully.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Together, we build a community where creativity, authenticity,
                and self-expression thrive.
              </p>
              <p className="text-xl font-semibold text-blue-600 italic">
                So, what's your next episode?
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Bravyn?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingBag className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                Crafted with the finest materials and attention to detail.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="text-2xl text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.841-1.726.5.5 0 11-.98.152A3.001 3.001 0 005.5 13zm4-2a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Shipping
              </h3>
              <p className="text-gray-600">
                Quick delivery to your doorstep with free shipping.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="text-2xl text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-2.77 3.066 3.066 0 00-3.58 3.03A6.001 6.001 0 006 10a6.001 6.001 0 00-6-6 3.066 3.066 0 003.58 3.03 3.066 3.066 0 001.735 2.77 3.066 3.066 0 00-4.95 1.588 3.066 3.066 0 002.38 4.03A6.001 6.001 0 006 19a6.001 6.001 0 004.733-9.545 3.066 3.066 0 00-4.466-3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Dedicated customer support whenever you need us.
              </p>
            </div>
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-bounce"
        title="Chat with us on WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </a>
    </>
  );
};

export default HomePage;
