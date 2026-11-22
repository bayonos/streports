import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const usernameRef = useRef(null)

  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  // Prefill saved username
  useEffect(() => {
    const saved = localStorage.getItem('saved_username')
    if (saved) setUsername(saved)
    usernameRef.current?.focus()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password
        })
      })

      const data = await res.json()

      if (data.success === true) {
        if (remember) {
          localStorage.setItem('saved_username', username.trim())
        } else {
          localStorage.removeItem('saved_username')
        }
        onLogin(data.username, from)
      } else {
        setError(
          data.message || 'ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ'
        )
      }
    } catch (err) {
      setError('មិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេបានទេ (Connection Error)')
      console.error('Login Fetch Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function handlePasswordKey(e) {
    if (e.getModifierState) {
      setCapsLock(e.getModifierState('CapsLock'))
    }
  }

  return (
    <div className="min-h-screen w-full flex font-khmer bg-gray-50">
      {/* ---------- Left: Branding Panel ---------- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[32rem] h-[32rem] bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-14 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">
                Stung Treng
              </div>
              <div className="text-xs text-blue-100/80">
                Provincial Hospital
              </div>
            </div>
          </div>

          {/* Hero copy */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              ប្រព័ន្ធគ្រប់គ្រង
              <br />
              <span className="text-cyan-300">របាយការណ៍ប្រចាំថ្ងៃ</span>
            </h1>
            <p className="text-blue-100/90 text-sm leading-relaxed">
              ចូលប្រើប្រាស់ដើម្បីគ្រប់គ្រងទិន្នន័យអ្នកជំងឺ ឯកសារ
              និងរបាយការណ៍សម្ភាពនៅមន្ទីរពេទ្យខេត្តស្ទឹងត្រែង។
            </p>

            <div className="flex items-center gap-6 mt-8 text-xs text-blue-100/70">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Secure & encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                <span>Real-time sync</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-blue-100/60">
            © {new Date().getFullYear()} Stung Treng Provincial Hospital
          </div>
        </div>
      </div>

      {/* ---------- Right: Form Panel ---------- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          {/* Mobile-only brand */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-600 items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              មន្ទីរពេទ្យខេត្តស្ទឹងត្រែង
            </h1>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              សូមស្វាគមន៍
            </h2>
            <p className="text-sm text-gray-500">
              ចូលប្រើប្រាស់ដើម្បីបន្តទៅកាន់ផ្ទាំងគ្រប់គ្រង
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2"
              >
                ឈ្មោះអ្នកប្រើប្រាស់
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  id="username"
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-60"
                  placeholder="admin"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
                >
                  ពាក្យសម្ងាត់
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  onClick={() =>
                    setError('សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin) ដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ')
                  }
                >
                  ភ្លេចពាក្យសម្ងាត់?
                </button>
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={handlePasswordKey}
                  onKeyDown={handlePasswordKey}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-60"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {capsLock && (
                <p className="mt-2 text-xs text-amber-600 flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Caps Lock ត្រូវបានបើក
                </p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-600">ចងចាំខ្ញុំ</span>
            </label>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-xl animate-[fadeIn_.2s_ease-out]">
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>កំពុងផ្ទៀងផ្ទាត់...</span>
                </>
              ) : (
                <>
                  <span>ចូលប្រើប្រាស់</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 flex items-center justify-between text-[11px] text-gray-400">
            <span>System v1.0</span>
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secured
            </span>
          </div>
        </div>
      </div>

      {/* Keyframes for subtle error fade */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}