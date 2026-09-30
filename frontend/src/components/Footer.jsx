export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          <div>
            <h3 className="text-xl font-bold mb-3 text-blue-400">shop</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              online shop...easy access
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">لینک‌های سریع</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>خانه</li>
              <li>محصولات</li>
              <li>درباره ما</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">تماس با ما</h3>
            <p className="text-gray-400 text-sm">telegram:@im_mohse_n</p>
            <p className="text-gray-400 text-sm mt-2">09366323951</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          have a good time:)
        </div>
      </div>
    </footer>
  );
}
