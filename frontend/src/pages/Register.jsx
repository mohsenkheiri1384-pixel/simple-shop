import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError({ password2: ["رمزها یکسان نیستن"] });
      return;
    }
    setLoading(true);
    setError({});
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data || { error: "خطا در ثبت‌نام" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
              <FiUserPlus size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800">
              حساب جدید بساز
            </h1>
            <p className="text-gray-500 text-sm mt-2">چند ثانیه‌ای عضو ما شو</p>
          </div>

          {/* Error */}
          {error.error && (
            <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-3 rounded-lg mb-5 text-sm slide-in">
              {error.error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  نام کاربری *
                </label>
                <div className="relative">
                  <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="input-field pr-12"
                    placeholder="username"
                    required
                  />
                </div>
                {error.username && (
                  <p className="text-red-600 text-xs mt-1">
                    {error.username[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  ایمیل
                </label>
                <div className="relative">
                  <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="input-field pr-12"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  نام
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                  className="input-field"
                  placeholder="علی"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                  className="input-field"
                  placeholder="احمدی"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">
                رمز عبور *
              </label>
              <div className="relative">
                <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="input-field pr-12"
                  placeholder="حداقل ۶ کاراکتر"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">
                تکرار رمز عبور *
              </label>
              <div className="relative">
                <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={form.password2}
                  onChange={(e) =>
                    setForm({ ...form, password2: e.target.value })
                  }
                  className="input-field pr-12"
                  placeholder="دوباره وارد کن"
                  required
                />
              </div>
              {error.password2 && (
                <p className="text-red-600 text-xs mt-1">
                  {error.password2[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "در حال ثبت..." : "ثبت‌نام"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 text-sm">
            حساب داری؟{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              وارد شو
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
