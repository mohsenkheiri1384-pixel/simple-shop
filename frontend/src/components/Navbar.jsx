import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
              S
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Shop
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              خانه
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  <FiUser />
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <FiLogOut />
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  ورود
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ padding: "8px 20px" }}
                >
                  ثبت‌نام
                </Link>
              </>
            )}

            <Link to="/cart" className="relative group">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FiShoppingCart
                  size={20}
                  className="text-gray-700 group-hover:text-blue-600 transition-colors"
                />
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-gray-100 fade-in">
            <Link
              to="/"
              className="block py-3 text-gray-700 font-medium"
              onClick={() => setOpen(false)}
            >
              خانه
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block py-3 text-gray-700 font-medium"
                  onClick={() => setOpen(false)}
                >
                  پروفایل ({user.username})
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-3 text-red-600 font-medium"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-3 text-gray-700 font-medium"
                  onClick={() => setOpen(false)}
                >
                  ورود
                </Link>
                <Link
                  to="/register"
                  className="block py-3 text-gray-700 font-medium"
                  onClick={() => setOpen(false)}
                >
                  ثبت‌نام
                </Link>
              </>
            )}
            <Link
              to="/cart"
              className="block py-3 text-gray-700 font-medium"
              onClick={() => setOpen(false)}
            >
              سبد خرید ({totalItems})
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
