 import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const LOGO_URL =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_fgi0UISkom4bjWqZ_6wxI_CEyykZD04BEEDq2ZwI56F-pK-04GtEIBoc&s=10'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const usernameRef = useRef(null)

  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

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
        body: JSON.stringify({ username: username.trim(), password }),
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
    <>
      {/* Google Fonts: Kantumruy Pro (Khmer + Latin) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap"
        rel="stylesheet"
      />

      <div className="kantumruy-pro relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-10 bg-slate-950 antialiased">
        {/* ---------- Background ---------- */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#061a45] via-[#0b3d91] to-[#0a2a6b]" />
        <div className="blob absolute -top-32 -left-24 w-[34rem] h-[34rem] rounded-full bg-sky-400/30 blur-3xl" />
        <div className="blob blob-2 absolute -bottom-40 -right-24 w-[38rem] h-[38rem] rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="blob blob-3 absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* ---------- Card ---------- */}
        <div className="card-in relative z-10 w-full max-w-[440px]">
          <div className="rounded-[28px] bg-white/90 backdrop-blur-2xl shadow-2xl shadow-black/30 ring-1 ring-white/60 px-7 py-9 sm:px-10 sm:py-11">
            {/* Logo + organization */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-3xl bg-white shadow-lg shadow-blue-900/15 ring-1 ring-slate-100 p-2.5 flex items-center justify-center overflow-hidden mb-5">
                {!logoError ? (
                  <img
                    src={LOGO_URL}
                    alt="Stung Treng Provincial Hospital"
                    className="w-full h-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <svg className="w-9 h-9 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 leading-snug">
                មន្ទីរពេទ្យខេត្តស្ទឹងត្រែង
              </h1>
              <p className="text-xs text-slate-500 font-light mt-1 tracking-wide">
                Stung Treng Provincial Hospital
              </p>
            </div>

            {/* Heading */}
            <div className="text-center mb-7">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                ប្រព័ន្ធគ្រប់គ្រងរបាយការណ៍ប្រចាំថ្ងៃ
              </h2>
              <p className="text-sm text-slate-500 font-light mt-2 leading-relaxed">
                សូមចូលប្រើប្រាស់ដើម្បីបន្តទៅកាន់ផ្ទាំងគ្រប់គ្រង
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-[13px] font-medium text-slate-700 mb-2">
                  ឈ្មោះអ្នកប្រើប្រាស់
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder-slate-400 text-sm font-normal focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all disabled:opacity-60"
                    placeholder="admin"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="text-[13px] font-medium text-slate-700">
                    ពាក្យសម្ងាត់
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    onClick={() =>
                      setError('សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin) ដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ')
                    }
                  >
                    ភ្លេចពាក្យសម្ងាត់?
                  </button>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder-slate-400 text-sm font-normal focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all disabled:opacity-60"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {capsLock && (
                  <p className="mt-2 text-xs text-amber-600 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
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
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-slate-600">ចងចាំខ្ញុំ</span>
              </label>

              {/* Error */}
              {error && (
                <div className="error-in flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-[13px] p-3.5 rounded-2xl">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>កំពុងផ្ទៀងផ្ទាត់...</span>
                  </>
                ) : (
                  <>
                    <span>ចូលប្រើប្រាស់</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Secure &amp; encrypted
              </span>
              <span>System v1.0</span>
            </div>
          </div>

          <p className="text-center text-[11px] text-blue-100/60 mt-5">
            © {new Date().getFullYear()} Stung Treng Provincial Hospital
          </p>
        </div>

        <style>{`
          .kantumruy-pro {
            font-family: "Kantumruy Pro", sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            font-style: normal;
          }
          .kantumruy-pro input,
          .kantumruy-pro button,
          .kantumruy-pro label {
            font-family: inherit;
          }
          @keyframes cardIn {
            from { opacity: 0; transform: translateY(16px) scale(.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .card-in { animation: cardIn .6s cubic-bezier(.2,.8,.2,1) both; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .error-in { animation: fadeIn .2s ease-out; }
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50%      { transform: translate(30px, -24px); }
          }
          .blob   { animation: float 14s ease-in-out infinite; }
          .blob-2 { animation-duration: 18s; animation-direction: reverse; }
          .blob-3 { animation-duration: 22s; }
          @media (prefers-reduced-motion: reduce) {
            .blob, .card-in { animation: none; }
          }
        `}</style>
      </div>
    </>
  )
}