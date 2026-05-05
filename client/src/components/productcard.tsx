import type { FC } from "react";
import { useEcomStore } from "../stores/productStore";
import { useUserStore } from "../stores/userStore";
import { Link } from "react-router-dom";
import { FaStar, FaShoppingBag } from "react-icons/fa";
import { COLORS } from "../lib/colors";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useEcomStore();
  const { user } = useUserStore();

  const handleAddToCart = () => {
    if (user) {
      addToCart(product);
    }
  };

  return (
    <div className="group h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col border border-gray-100 hover:border-blue-300">
      <Link to={`/product/${product.id}`} className="block flex-shrink-0">
        <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center block group-hover:scale-110 transition-transform duration-500 ease-in-out"
            style={{ aspectRatio: "1/1" }}
          />
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          <div
            className="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ backgroundColor: COLORS.error }}
          >
            -20%
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="w-3 h-3 text-yellow-400" />
          ))}
          <span className="text-xs text-gray-600 ml-1">(28)</span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3
            className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:transition-colors"
            style={{ color: COLORS.textPrimary }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-lg font-bold" style={{ color: COLORS.primary }}>
            ₹{product.price}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ₹{Math.round(product.price * 1.25)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!user}
          className="w-full mt-auto py-3 text-white font-semibold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-md hover:shadow-lg"
          style={{
            background: user ? COLORS.gradient : `${COLORS.primaryLight}80`,
          }}
        >
          <FaShoppingBag className="group-hover:animate-bounce" />
          {user ? "Add to Cart" : "Login to Add"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
