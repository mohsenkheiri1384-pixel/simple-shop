import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../api/orders";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiPhone, FiMapPin, FiCheckCircle } from "react-icons/fi";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name:
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
      user?.username ||
      "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const orderData = {
        ...form,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };
      await orderAPI.create(orderData);
      clearCart();
      navigate("/profile", { state: { success: "سفارش با موفقیت ثبت شد!" } });
    } catch (err) {
      setError(err.response?.data?.error || "خطا در ثبت سفارش");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
          <FiCheckCircle size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800">
          نهایی کردن سفارش
        </h1>
        <p className="text-gray-500 mt-2">اطلاعات ارسال رو وارد کن</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 fade-in space-y-5"
      >
        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-3 rounded-lg slide-in">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">
            نام و نام خانوادگی
          </label>
          <div className="relative">
            <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="input-field pr-12"
              placeholder="علی احمدی"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">
            شماره تماس
          </label>
          <div className="relative">
            <FiPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field pr-12"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 text-sm">
            آدرس
          </label>
          <div className="relative">
            <FiMapPin className="absolute right-4 top-4 text-gray-400" />
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-field pr-12"
              rows="3"
              placeholder="تهران، خیابان ولیعصر، پلاک ۱۲۳"
              required
            />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-5">
          <div className="flex justify-between items-center mb-5">
            <span className="font-bold text-gray-700">جمع کل:</span>
            <div className="text-left">
              <div className="text-2xl font-extrabold text-blue-600">
                {totalPrice.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">تومان</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "در حال ثبت..." : "ثبت سفارش"}
          </button>
        </div>
      </form>
    </div>
  );
}
