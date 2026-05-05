// src/pages/ProfilePage.tsx
import { useUserStore } from "../../stores/userStore";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaHome,
  FaBoxOpen,
} from "react-icons/fa";

const ProfilePage = () => {
  const { user, logoutUser } = useUserStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUser className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Please Log In
          </h1>
          <p className="text-gray-600 mb-8">
            You need to log in to view your profile and access your account.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 mb-4"
          >
            Go to Login
          </button>
          <Link
            to="/"
            className="w-full py-3 border-2 border-gray-200 text-gray-900 font-semibold rounded-lg transition-all duration-300 hover:border-blue-600 hover:bg-blue-50 block"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-8 mb-12">
            {/* Name */}
            <div className="pb-6 border-b border-gray-200">
              <label className="flex items-center gap-3 text-sm font-semibold text-gray-600 mb-2">
                <FaUser className="text-blue-600" />
                Full Name
              </label>
              <p className="text-2xl font-bold text-gray-900 ml-7">
                {user.name}
              </p>
            </div>

            {/* Email */}
            <div className="pb-6 border-b border-gray-200">
              <label className="flex items-center gap-3 text-sm font-semibold text-gray-600 mb-2">
                <FaEnvelope className="text-blue-600" />
                Email Address
              </label>
              <p className="text-2xl font-bold text-gray-900 ml-7">
                {user.email}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <Link
              to="/orders"
              className="flex items-center justify-center gap-2 py-3 px-6 bg-indigo-50 text-indigo-700 font-bold rounded-lg transition-all duration-300 hover:bg-indigo-100 active:scale-95"
            >
              <FaBoxOpen />
              View Orders
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-700 active:scale-95"
            >
              <FaHome />
              Back to Shop
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-red-50 text-red-600 font-bold rounded-lg transition-all duration-300 hover:bg-red-100 active:scale-95"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
