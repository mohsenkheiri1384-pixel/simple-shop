import { useEffect, useState } from "react";
import { productAPI, categoryAPI } from "../api/products";
import ProductCard from "../components/ProductCard";
import { FiSearch, FiSliders } from "react-icons/fi";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ordering, setOrdering] = useState("");

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => setCategories(res.data.results || res.data))
      .catch((err) => console.error("Categories error:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (ordering) params.ordering = ordering;

    productAPI
      .getAll(params)
      .then((res) => setProducts(res.data.results || res.data))
      .catch((err) => console.error("Products error:", err))
      .finally(() => setLoading(false));
  }, [search, selectedCategory, ordering]);

  return (
    <div className="container-custom py-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-l from-blue-600 via-purple-600 to-pink-600 text-white rounded-3xl p-8 md:p-12 mb-10 fade-in">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
            Welcom to shop 🛒
          </h1>
          <p className="text-base md:text-xl opacity-90">
            Online Shop...Just one click 
          </p>
        </div>
        {/* افکت‌های تزئینی */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در محصولات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pr-12"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field md:w-48 cursor-pointer"
          >
            <option value="">همه‌ی دسته‌ها</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="input-field md:w-48 cursor-pointer"
          >
            <option value="">مرتب‌سازی پیش‌فرض</option>
            <option value="-created_at">جدیدترین</option>
            <option value="price">ارزان‌ترین</option>
            <option value="-price">گران‌ترین</option>
            <option value="name">حروف الفبا</option>
          </select>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="spinner"></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h2>محصولی پیدا نشد</h2>
          <p>فیلترها رو تغییر بده یا دوباره جستجو کن</p>
        </div>
      ) : (
        <>
          <h2 className="section-title">
            محصولات
            <span className="text-base font-normal text-gray-500 mr-3">
              ({products.length} محصول)
            </span>
          </h2>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
