import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">صفحه پیدا نشد</h2>
      <p className="text-gray-500 mb-8">صفحه‌ای که دنبالش هستی وجود نداره</p>
      <Link to="/" className="btn-primary inline-block">
        بازگشت به خانه
      </Link>
    </div>
  );
}
