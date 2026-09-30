import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiShoppingCart } from "react-icons/fi";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card group fade-in">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              بدون تصویر
            </div>
          )}

          {product.discount > 0 && (
            <span className="absolute top-3 right-3 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {product.discount}% تخفیف
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-base mb-2 text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          <div className="mb-3">
            <span className="text-lg font-extrabold text-gray-900">
              {product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 mr-1">تومان</span>
          </div>

          {product.is_available ? (
            <button
              onClick={() => addToCart(product)}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              style={{ padding: "10px" }}
            >
              <FiShoppingCart size={16} />
              افزودن به سبد
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-400 font-medium cursor-not-allowed"
            >
              ناموجود
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
