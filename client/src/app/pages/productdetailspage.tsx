import type { FC } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEcomStore } from "../../stores/productStore";
import { useUserStore } from "../../stores/userStore";
import { Link } from "react-router-dom";

const ProductDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, fetchProducts, addToCart } = useEcomStore();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (products.length === 0) {
          await fetchProducts();
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
        console.error("Error loading products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [fetchProducts, products.length]);

  const product = products.find((p) => p.id === id);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4 text-red-500">
            <svg
              className="w-12 h-12 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            Error Loading Product
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="text-blue-500 hover:underline font-semibold">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-8 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-block text-blue-500 hover:underline font-semibold"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (user) {
      addToCart(product);
      alert(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-medium"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm p-6 md:p-12">
          <div className="flex flex-col justify-center">
            <div className="rounded-xl overflow-hidden shadow-lg bg-gray-100 h-96 md:h-full flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <div className="flex-1 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-2 hover:border-gray-400 transition-all">
                <img
                  src={product.image}
                  alt="thumb"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  Premium
                </span>
                <span className="flex items-center gap-1 text-sm text-yellow-500">
                  ★★★★★{" "}
                  <span className="text-gray-600 ml-1">(128 reviews)</span>
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 text-sm">SKU: PROD-{product.id}</p>
            </div>

            <div className="border-y border-gray-200 py-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-5xl font-bold text-blue-600">
                  ₹{product.price}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ₹{Math.round(product.price * 1.2)}
                </span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 font-semibold text-sm rounded">
                  20% OFF
                </span>
              </div>
              <p className="text-sm text-green-600 font-medium">
                ✓ Free shipping on orders above ₹500
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About this product
              </h3>
              <p className="text-gray-700 leading-relaxed">
                This is a high-quality {product.name}. Designed with premium
                materials and attention to detail, this product offers
                exceptional style and comfort. Perfect for everyday wear and
                special occasions.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Premium quality materials
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Durable and long-lasting
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Easy to maintain and care for
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm p-3 bg-green-50 rounded-lg">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-800 font-medium">
                In Stock - Free delivery available
              </span>
            </div>

            <div className="space-y-3 pt-4">
              {user ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 px-6 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m0 0h6m0 0h-6m-6 0H0"
                    />
                  </svg>
                  Add to Cart
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full py-4 px-6 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-200 block text-center shadow-lg hover:shadow-xl"
                >
                  Login to Add to Cart
                </Link>
              )}
              <button className="w-full py-4 px-6 border-2 border-gray-300 text-gray-900 font-bold text-lg rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                <svg
                  className="w-5 h-5 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Save for Later
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">30</p>
                <p className="text-sm text-gray-600">Days Return</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600">Authentic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
