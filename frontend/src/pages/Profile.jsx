import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { orderAPI } from "../api/orders";

export default function Profile() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.success;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    orderAPI
      .getAll()
      .then((res) => setOrders(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, [user]);

  const statusMap = {
    pending: {
      text: "در انتظار تایید",
      color: "bg-yellow-100 text-yellow-700",
    },
    confirmed: { text: "تایید شده", color: "bg-blue-100 text-blue-700" },
    sent: { text: "ارسال شده", color: "bg-purple-100 text-purple-700" },
    delivered: { text: "تحویل داده شده", color: "bg-green-100 text-green-700" },
    canceled: { text: "لغو شده", color: "bg-red-100 text-red-700" },
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto">
            {user.username[0].toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-center">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-500 text-center">@{user.username}</p>
          <p className="text-gray-500 text-center text-sm mt-2">{user.email}</p>
          <button onClick={logout} className="btn-danger w-full mt-6">
            خروج از حساب
          </button>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-4">سفارش‌های من</h1>
          {loading ? (
            <div className="text-center py-8">در حال بارگذاری...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              هنوز سفارشی ثبت نکردی
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold">سفارش #{order.id}</span>
                    <span className="px-3 py-1 rounded-full text-sm ${statusMap[order.status]?.color}">
                      {statusMap[order.status]?.text}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {new Date(order.created_at).toLocaleDateString("fa-IR")}
                  </p>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.product_name} × {item.quantity}
                        </span>
                        <span>{item.subtotal.toLocaleString()} تومان</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                    <span>جمع کل:</span>
                    <span>{order.total_price.toLocaleString()} تومان</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
