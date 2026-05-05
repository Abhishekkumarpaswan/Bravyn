import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaShoppingBag } from "react-icons/fa";
import { useUserStore } from "../../stores/userStore";
import { useOrderStore } from "../../stores/orderStore";

const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

const OrdersPage = () => {
  const { user } = useUserStore();
  const {
    orderHistory,
    loading,
    error,
    getUserOrders,
    clearOrderHistory,
    setError,
  } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    getUserOrders(user.id);
  }, [getUserOrders, user?.id]);

  useEffect(() => {
    return () => {
      clearOrderHistory();
      setError(null);
    };
  }, [clearOrderHistory, setError]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBoxOpen className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-8">
            You need to log in to view your order history.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 mb-4"
          >
            Go to Login
          </button>
          <Link
            to="/"
            className="block w-full py-3 border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-blue-600 hover:bg-blue-50"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/profile")}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
        >
          <FaArrowLeft /> Back to Profile
        </button>

        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-2 text-gray-600">
              Every order placed with your account appears here.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="mt-4 font-medium text-gray-600">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-2xl font-bold text-red-700">Could not load orders</h2>
            <p className="mt-3 text-red-600">{error}</p>
            <button
              onClick={() => getUserOrders(user.id)}
              className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : orderHistory.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <FaBoxOpen className="text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">No Orders Yet</h2>
            <p className="mt-3 text-gray-600">
              Once you place an order, it will stay visible here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orderHistory.map((order) => (
              <article
                key={order.orderId}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                      {order.orderId}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(order.createdAt || new Date()).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm md:text-right">
                    <div>
                      <p className="text-gray-500">Payment</p>
                      <p className="font-semibold uppercase text-gray-900">
                        {order.paymentDetails.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Order Status</p>
                      <p className="font-semibold uppercase text-gray-900">
                        {order.orderStatus}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="text-xl font-bold text-blue-700">
                        {formatCurrency(order.pricing.total)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[2fr_1fr]">
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Items
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={`${order.orderId}-${item.productId}`}
                          className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-800">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Shipping
                    </h3>
                    <div className="rounded-xl bg-gray-50 px-4 py-4 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">
                        {order.shippingAddress.name}
                      </p>
                      <p className="mt-1">{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city} - {order.shippingAddress.zip}
                      </p>
                      <p className="mt-2">{order.shippingAddress.email}</p>
                      {order.mobileNumber && <p>{order.mobileNumber}</p>}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
