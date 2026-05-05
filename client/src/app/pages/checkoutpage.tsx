import type { FC } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaCreditCard, FaLock } from "react-icons/fa";
import { useEcomStore } from "../../stores/productStore";
import { useUserStore } from "../../stores/userStore";
import { useOrderStore, type Order } from "../../stores/orderStore";

type CheckoutStatus = "idle" | "success" | "failure";

const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

const CheckoutPage: FC = () => {
  const { cart, clearCart } = useEcomStore();
  const { user } = useUserStore();
  const {
    placeOrder,
    loading: orderLoading,
    error: orderError,
    setCurrentOrder,
    setError,
  } = useOrderStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("cod");
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [submissionError, setSubmissionError] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    zip: "",
    mobileNumber: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const taxAmount = cartTotal * 0.1;
  const shippingAmount = cartTotal > 500 ? 0 : 50;
  const finalTotal = cartTotal + taxAmount + shippingAmount;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.zip.trim()) newErrors.zip = "ZIP code is required";
    else if (!/^\d{5,6}$/.test(formData.zip))
      newErrors.zip = "ZIP code must be 5-6 digits";

    if (paymentMethod === "stripe") {
      if (!formData.cardNumber.trim())
        newErrors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
        newErrors.cardNumber = "Card number must be 16 digits";
      if (!formData.expiry.trim()) newErrors.expiry = "Expiry date is required";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry))
        newErrors.expiry = "Expiry must be MM/YY";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(formData.cvv))
        newErrors.cvv = "CVV must be 3-4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetSubmissionState = () => {
    setCheckoutStatus("idle");
    setSubmissionError("");
    setPlacedOrder(null);
    setCurrentOrder(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError("");

    if (!validate()) return;
    if (!user?.id) {
      setSubmissionError("You must be logged in to place an order.");
      setCheckoutStatus("failure");
      return;
    }

    const result = await placeOrder(
      {
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
        },
        mobileNumber: formData.mobileNumber,
        paymentMethod,
      },
      user.id,
    );

    if (!result) {
      setSubmissionError(orderError || "Order placement failed. Please try again.");
      setCheckoutStatus("failure");
      return;
    }

    clearCart();
    setPlacedOrder(result.order);
    setCheckoutStatus("success");
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Please Log In
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            You need to be logged in to complete your purchase.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors font-medium flex items-center gap-2"
            >
              <FaArrowLeft /> Back to Shop
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStatus === "success" && placedOrder) {
    const orderDate = new Date(placedOrder.createdAt || new Date()).toLocaleString(
      "en-IN",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
            ✓
          </div>
          <h1 className="text-center text-4xl font-bold text-gray-900">
            Congratulations!
          </h1>
          <p className="mt-4 text-center text-lg text-gray-600">
            {paymentMethod === "stripe"
              ? "Your order has been created and payment is now pending confirmation."
              : "Your order was placed successfully and has been saved to your account."}
          </p>

          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Order ID
              </span>
              <span className="font-bold text-gray-900">{placedOrder.orderId}</span>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>Placed On</span>
                <span className="font-medium">{orderDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment</span>
                <span className="font-medium uppercase">
                  {placedOrder.paymentDetails.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Order Status</span>
                <span className="font-medium uppercase">{placedOrder.orderStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-bold text-blue-700">
                  {formatCurrency(placedOrder.pricing.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              View My Orders
            </button>
            <button
              onClick={() => {
                resetSubmissionState();
                navigate("/");
              }}
              className="flex-1 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:border-blue-500 hover:text-blue-600"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (checkoutStatus === "failure") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl text-red-600">
            !
          </div>
          <h1 className="text-center text-4xl font-bold text-gray-900">
            Order Failed
          </h1>
          <p className="mt-4 text-center text-lg text-gray-600">
            {submissionError || "We could not place your order."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={resetSubmissionState}
              className="flex-1 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Retry Order
            </button>
            <button
              onClick={() => {
                resetSubmissionState();
                navigate("/");
              }}
              className="flex-1 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:border-blue-500 hover:text-blue-600"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Add some items to your cart before checking out.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/cart")}
          className="mb-8 flex items-center gap-2 font-medium text-gray-600 transition-colors hover:text-blue-600"
        >
          <FaArrowLeft /> Back to Cart
        </button>

        <h1 className="mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
          Complete Your Purchase
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white p-8 shadow-lg"
            >
              <div className="mb-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        errors.name
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm font-medium text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm font-medium text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                        errors.address
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-2 text-sm font-medium text-red-500">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block font-semibold text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                          errors.city
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-2 text-sm font-medium text-red-500">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-gray-700">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                          errors.zip
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                      {errors.zip && (
                        <p className="mt-2 text-sm font-medium text-red-500">
                          {errors.zip}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="+91 10 digits"
                      className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8 border-t pt-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex cursor-pointer items-center rounded-lg border-2 p-4 transition-colors ${
                      paymentMethod === "cod"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="h-4 w-4"
                    />
                    <span className="ml-3 font-semibold text-gray-700">
                      Cash on Delivery
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center rounded-lg border-2 p-4 transition-colors ${
                      paymentMethod === "stripe"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                      className="h-4 w-4"
                    />
                    <FaCreditCard className="ml-3 text-blue-600" />
                    <span className="ml-2 font-semibold text-gray-700">
                      Credit or Debit Card (Stripe)
                    </span>
                  </label>
                </div>
              </div>

              {paymentMethod === "stripe" && (
                <div className="border-t pt-8">
                  <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800">
                    <FaLock className="text-blue-600" /> Payment Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block font-semibold text-gray-700">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                          errors.cardNumber
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="mt-2 text-sm font-medium text-red-500">
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block font-semibold text-gray-700">
                          Expiry
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className={`w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            errors.expiry
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        />
                        {errors.expiry && (
                          <p className="mt-2 text-sm font-medium text-red-500">
                            {errors.expiry}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          className={`w-full rounded-lg border-2 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            errors.cvv
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        />
                        {errors.cvv && (
                          <p className="mt-2 text-sm font-medium text-red-500">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(submissionError || orderError) && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {submissionError || orderError}
                </div>
              )}

              <button
                type="submit"
                disabled={orderLoading}
                className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {orderLoading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <FaBoxOpen />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                  <p className="text-sm text-gray-500">
                    {cart.length} item{cart.length === 1 ? "" : "s"} in your cart
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-b border-gray-200 pb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-6 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(shippingAmount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(finalTotal)}
                </span>
              </div>

              <Link
                to="/cart"
                className="mt-6 block rounded-xl border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
              >
                Review Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
