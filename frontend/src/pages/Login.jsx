import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.username, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'نام کاربری یا رمز اشتباهه')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md fade-in">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
              <FiLogIn size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800">خوش برگشتی!</h1>
            <p className="text-gray-500 text-sm mt-2">وارد حساب کاربریت شو</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-3 rounded-lg mb-5 text-sm slide-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">
                نام کاربری
              </label>
              <div className="relative">
                <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input-field pr-12"
                  placeholder="نام کاربری خودت رو وارد کن"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">
                رمز عبور
              </label>
              <div className="relative">
                <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-12"
                  placeholder="رمز عبورت رو وارد کن"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-gray-600 text-sm">
            حساب نداری؟{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
              همین حالا ثبت‌نام کن
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}