import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI } from "../api/products";
import { useCart } from "../context/CartContext";
import { FiArrowRight, FiMinus, FiPlus } from "react-icons/fi";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    productAPI
      .getOne(id)
      .then((res) => setProduct(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="text-center py-12">در حال بارگذاری...</div>;
  if (!product)
    return <div className="text-center py-12">محصول پیدا نشد :(</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-blue-600 "
      >
        <FiArrowRight /> بازگشت
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden ">
          {product.image ? (
            <img
              src={product.image}
              alt={product.image}
              className="w-full h-full object-cover  "
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 ">
              بدون تصویر{" "}
            </div>
          )}
        </div>

        <div>
          <h1 className=" flex items-center gap-3 ">{product.name}</h1>
          <p className=" text-gray-500 mb-4 ">{product.category_name}</p>
          <p className="text-gray-700 mb-6 leading-relaxed ">
            {product.description}
          </p>

          <div className="mb-6">
            {product.discount > 0 ? (
              <div className=" flex items-center gap-3 ">
                <span className=" text-2xl text-gray-400 line-through ">
                  {product.price.toLocaleString()}
                </span>
                <span className=" text-4xl font-bold text-red-600 ">
                  {product.final_price.toLocaleString()}
                </span>
                <span className="text-gray-600">تومان</span>
                <span className=" bg-red-500 text-white text-xs px-2 py-1 rounded ">
                  {product.discount}%
                </span>
              </div>
            ) : (
              <span className="text-4xl font-bold ">
                {product.price.toLocaleString()} تومان
              </span>
            )}
          </div>

          <div className="mb-6">
            <span
              className={
                product.is_available ? "text-green-600" : "text-red-600"
              }
            >
              {product.is_available
                ? `موجود در انبار (${product.stock}عدد)`
                : "ناموجود"}
            </span>
          </div>

          {product.is_available && (
            <>
              <div className="flex items-center gap-4 mb-6 ">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border rounded-lg hover:bg-gray-100"
                >
                  <FiMinus />
                </button>
                <span className="text-xl font-bold w-12 text-center ">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border rounded-lg hover:bg-gray-100"
                >
                  <FiPlus />
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(product, quantity);
                  navigate("/cart");
                }}
                className="btn-primary w-full"
              >
                افزودن به سبد خرید
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
