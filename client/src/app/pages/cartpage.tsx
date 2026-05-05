import type { FC } from "react";
import { useEcomStore } from "../../stores/productStore";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash, FaArrowLeft } from "react-icons/fa";

const CartPage: FC = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useEcomStore();
  const navigate = useNavigate();

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const taxes = Math.round(cartTotal * 0.1);
  const grandTotal = cartTotal + taxes;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft />
            Continue Shopping
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6 text-center">
              Looks like you haven't added anything yet. Time to find some swag!
            </p>
            <Link
              to="/"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {cart.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 ${index !== cart.length - 1 ? "border-b border-gray-200" : ""}`}
                  >
                    <Link
                      to={`/product/${item.id}`}
                      className="flex-1 flex gap-4"
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-blue-600 font-bold text-lg mt-2">
                          ₹{item.price}
                        </p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-2 hover:bg-gray-200 transition-colors rounded text-gray-700"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-2 hover:bg-gray-200 transition-colors rounded text-gray-700"
                        aria-label="Increase quantity"
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="font-bold text-gray-900 text-lg">
                        ₹{item.price * item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">Subtotal</p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove from cart"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes (10%)</span>
                    <span>₹{taxes}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{grandTotal}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors active:scale-95 mb-4"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => clearCart()}
                  className="w-full py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
