import type { FC } from "react";
import { useEffect, useState } from "react";
import ProductCard from "./productcard";
import { useEcomStore } from "../stores/productStore";

const ProductGrid: FC = () => {
  const { products, fetchProducts } = useEcomStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchProducts();
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading our collection...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Collection
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore our curated selection of premium products designed for those
          who dare to be different.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max">
        {(products && products.length) > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 font-medium">No products available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
