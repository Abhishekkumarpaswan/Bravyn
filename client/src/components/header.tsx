import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEcomStore } from "../stores/productStore";
import { useUserStore } from "../stores/userStore";
import {
  FaBars,
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaTimes,
  FaSignOutAlt,
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaBoxOpen,
} from "react-icons/fa";
import NotificationBar from "./notificationbar";

const Header = () => {
  const { cart, notification } = useEcomStore();
  const { user, logoutUser } = useUserStore();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        setScrolled(window.scrollY > 50);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { to: "/", text: "Shop", icon: FaHome },
    { to: "/about", text: "About", icon: FaInfoCircle },
    { to: "/contact", text: "Contact", icon: FaPhone },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <div
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300`}
    >
      <NotificationBar
        message={notification.message}
        isVisible={notification.isVisible}
      />
      <header
        className={`w-full z-50 transition-all duration-300 bg-white ${scrolled ? "shadow-lg" : "shadow-md"}`}
      >
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-2xl text-gray-800 hover:text-blue-600 transition-colors duration-200 p-2"
              aria-label="Menu"
            >
              <FaBars />
            </button>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-xl md:text-2xl cursor-pointer text-gray-800 hover:text-blue-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
              aria-label="Search"
            >
              <FaSearch />
            </button>

            {user && (
              <Link
                to="/profile"
                className="text-xl md:text-2xl cursor-pointer text-gray-800 hover:text-blue-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full hidden md:block"
                aria-label="Profile"
              >
                <FaUser />
              </Link>
            )}
          </div>

          <Link
            to="/"
            className="text-xl md:text-2xl font-bold uppercase tracking-widest hover:text-blue-600 transition-colors duration-200"
          >
            <span className="text-blue-600">BRAVYN</span>
          </Link>

          <div className="flex items-center space-x-3 md:space-x-4">
            {user && (
              <Link
                to="/cart"
                className="text-lg md:text-xl cursor-pointer text-gray-800 hover:text-blue-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full relative"
                aria-label="Shopping Cart"
              >
                <FaShoppingBag className="text-xl md:text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {!user && (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-block px-5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden md:inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}

            {user && (
              <button
                onClick={() => {
                  logoutUser();
                  navigate("/");
                  setSidebarOpen(false);
                }}
                className="hidden md:inline-block px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                aria-label="Logout"
              >
                <FaSignOutAlt className="text-base" />
                Logout
              </button>
            )}
          </div>
        </div>

        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top py-4 px-4 md:px-8">
            <form onSubmit={handleSearch} className="container mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FaSearch className="text-lg" />
                </button>
              </div>
            </form>
          </div>
        )}
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 md:hidden overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ marginTop: "0" }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-blue-600">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl hover:text-red-600 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col space-y-1 px-4 py-6 pb-40">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="w-full flex items-center gap-3 text-left py-3 px-4 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium text-gray-800"
                onClick={() => setSidebarOpen(false)}
              >
                <IconComponent className="text-lg" />
                {link.text}
              </Link>
            );
          })}

          <div className="my-4 border-t border-gray-200" />

          {!user && (
            <div className="space-y-2 py-4">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-semibold"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUser className="text-lg" />
                Login
              </Link>
              <Link
                to="/register"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUser className="text-lg" />
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <div className="py-4 space-y-2">
              <Link
                to="/profile"
                className="w-full flex items-center gap-3 py-3 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUser className="text-lg" />
                My Profile
              </Link>
              <Link
                to="/cart"
                className="w-full flex items-center gap-3 py-3 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                <FaShoppingBag className="text-lg" />
                My Cart
              </Link>
              <Link
                to="/orders"
                className="w-full flex items-center gap-3 py-3 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                <FaBoxOpen className="text-lg" />
                My Orders
              </Link>
              <button
                onClick={() => {
                  logoutUser();
                  navigate("/");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-md"
              >
                <FaSignOutAlt className="text-lg" />
                Logout
              </button>
            </div>
          )}
        </nav>

        {user && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-gradient-to-t from-gray-50 to-white p-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {user.name}
                </p>
                <p className="text-gray-600 text-xs truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
