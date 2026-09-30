import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowLeft,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="empty-state fade-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <FiShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2>سبد خرید خالی است</h2>
          <p className="mb-6">هنوز محصولی به سبد اضافه نکردی</p>
          <Link
            to="/"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <FiArrowLeft />
            رفتن به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="section-title">
        سبد خرید
        <span className="text-base font-normal text-gray-500 mr-3">
          ({totalItems} کالا)
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4 border border-gray-100 fade-in"
            >
              <Link to={`/product/${item.id}`}>
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      بدون تصویر
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    to={`/product/${item.id}`}
                    className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.category_name || "دسته‌بندی نشده"}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <div className="text-left">
                    <div className="font-extrabold text-gray-900">
                      {(item.final_price || item.price).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">تومان</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="self-start w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                title="حذف از سبد"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
            <h2 className="text-xl font-bold mb-5 pb-4 border-b border-gray-100 text-gray-800">
              خلاصه‌ی سفارش
            </h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-gray-600">
                <span>تعداد اقلام:</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>هزینه ارسال:</span>
                <span className="font-semibold text-green-600">رایگان</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">جمع کل:</span>
                <div className="text-left">
                  <div className="text-2xl font-extrabold text-blue-600">
                    {totalPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">تومان</div>
                </div>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn btn-primary w-full">
              ادامه‌ی سفارش
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
