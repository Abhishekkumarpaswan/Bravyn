import type { FC } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuthButton from "../../components/googleauthbutton";
import { useUserStore } from "../../stores/userStore";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaSpinner,
  FaUserPlus,
} from "react-icons/fa";

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const {
    registerUser,
    googleAuth,
    setError: setAuthError,
  } = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setAuthError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const success = await registerUser(name, email, password);
      if (success) {
        navigate("/");
      } else {
        setError(
          useUserStore.getState().error ||
            "Registration failed. Please try again.",
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (credential: string) => {
    setLoading(true);
    setError("");
    setAuthError(null);

    const success = await googleAuth(credential);
    if (success) {
      navigate("/");
    } else {
      setError(
        useUserStore.getState().error ||
          "Google sign-up failed. Please try again.",
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-md w-full relative z-10">
        {/* Animated Background Card */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-10 transform scale-95" />

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
          {/* Header - Animated */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <FaUserPlus className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Join BRAVYN
            </h1>
            <p className="text-gray-600 text-sm">
              Be bold. Be authentically you.
            </p>
          </div>

          {/* Error Message - Enhanced */}
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake">
              <p className="font-semibold text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <GoogleAuthButton
              text="signup_with"
              onCredential={handleGoogleRegister}
            />
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Or create with email
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent" />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div className="group">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors"
              >
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  id="name"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="group">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors"
              >
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors"
              >
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  id="password"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-2">
                Minimum 6 characters
              </p>
            </div>

            {/* Confirm Password Input */}
            <div className="group">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-800 mb-2 group-focus-within:text-blue-600 transition-colors"
              >
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/50 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-6"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-lg" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
              Have an Account?
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-gray-200 to-transparent" />
          </div>

          {/* Login Link - Enhanced */}
          <Link
            to="/login"
            className="w-full py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-xl transition-all duration-300 hover:bg-blue-50 text-center group flex items-center justify-center gap-2"
          >
            Sign In Instead
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 mt-8 text-sm font-medium">
          By signing up, you agree to our{" "}
          <a
            href="#"
            className="text-white font-bold hover:underline transition-all"
          >
            Terms & Conditions
          </a>
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
