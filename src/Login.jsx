import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const LOGO_URL =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_fgi0UISkom4bjWqZ_6wxI_CEyykZD04BEEDq2ZwI56F-pK-04GtEIBoc&s=10'

const FEATURES = [
  {
    title: 'គ្រប់គ្រងទិន្នន័យអ្នកជំងឺ',
    desc: 'កត់ត្រា និងតាមដានបានរហ័ស',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    title: 'របាយការណ៍ប្រចាំថ្ងៃ',
    desc: 'សង្ខេប និងនាំចេញងាយស្រួល',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    title: 'សុវត្ថិភាពខ្ពស់',
    desc: 'ទិន្នន័យត្រូវបានការពារ',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
]

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

  const Logo = ({ className = '' }) =>
    !logoError ? (
      <img
        src={LOGO_URL}
        alt="Stung Treng Provincial Hospital"
        className={`object-contain ${className}`}
        onError={() => setLogoError(true)}
      />
    ) : (
      <svg className={`text-teal-600 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    )

  return (
    <>
      {/* Google Fonts: Kantumruy Pro */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap"
        rel="stylesheet"
      />

      <div className="kantumruy-pro min-h-screen w-full bg-white flex p-0 lg:p-4 antialiased">
        {/* ---------- Left: Showcase panel ---------- */}
        <aside className="hidden lg:flex lg:w-[52%] relative overflow-hidden rounded-[32px] bg-[#04282c] text-white">
          <div className="orb absolute -top-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-teal-400/30 blur-3xl" />
          <div className="orb orb-2 absolute -bottom-32 -left-20 w-[30rem] h-[30rem] rounded-full bg-emerald-500/25 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            }}
          />

          <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-14">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center overflow-hidden shadow-lg shadow-black/20">
                <Logo className="w-full h-full" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">មន្ទីរពេទ្យខេត្តស្ទឹងត្រែង</div>
                <div className="text-xs text-teal-100/70">Stung Treng Provincial Hospital</div>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 text-xs text-teal-50 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ប្រព័ន្ធដំណើរការជាធម្មតា
              </span>
              <h1 className="text-4xl xl:text-[44px] font-bold leading-[1.3] mb-4">
                ប្រព័ន្ធគ្រប់គ្រង
                <br />
                <span className="text-teal-300">របាយការណ៍ប្រចាំថ្ងៃ</span>
              </h1>
              <p className="text-teal-50/70 text-[15px] leading-[1.9] max-w-md">
                គ្រប់គ្រងទិន្នន័យអ្នកជំងឺ ឯកសារ និងរបាយការណ៍សម្ភាពនៅមន្ទីរពេទ្យខេត្តស្ទឹងត្រែង
                ក្នុងកន្លែងតែមួយ។
              </p>

              <div className="mt-9 space-y-3 max-w-md">
                {FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-4 rounded-2xl bg-white/[0.07] ring-1 ring-white/10 backdrop-blur-sm px-4 py-3.5 hover:bg-white/[0.11] transition-colors"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-400/20 text-teal-200 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{f.title}</div>
                      <div className="text-xs text-teal-100/60 mt-0.5">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-teal-100/40">
              © {new Date().getFullYear()} Stung Treng Provincial Hospital
            </div>
          </div>
        </aside>

        {/* ---------- Right: Form ---------- */}
        <main className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-[400px] form-in">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-1.5 flex items-center justify-center overflow-hidden">
                <Logo className="w-full h-full" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold text-slate-900">មន្ទីរពេទ្យខេត្តស្ទឹងត្រែង</div>
                <div className="text-xs text-slate-500">Stung Treng Provincial Hospital</div>
              </div>
            </div>

            <div className="mb-9">
              <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
                សូមស្វាគមន៍ 👋
              </h2>
              <p className="text-[15px] text-slate-500 mt-2.5 leading-relaxed">
                បញ្ចូលព័ត៌មានគណនីរបស់អ្នក ដើម្បីចូលទៅកាន់ផ្ទាំងគ្រប់គ្រង
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username (floating label) */}
              <div className="relative">
                <input
                  id="username"
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="username"
                  placeholder=" "
                  className="peer w-full h-14 pl-12 pr-4 pt-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 text-[15px] focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all disabled:opacity-60"
                />
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-teal-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <label
                  htmlFor="username"
                  className="pointer-events-none absolute left-12 top-2.5 text-[11px] font-medium text-slate-500 transition-all
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
                    peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-teal-600"
                >
                  ឈ្មោះអ្នកប្រើប្រាស់
                </label>
              </div>

              {/* Password (floating label) */}
              <div>
                <div className="relative">
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
                    placeholder=" "
                    className="peer w-full h-14 pl-12 pr-12 pt-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 text-[15px] focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 transition-all disabled:opacity-60"
                  />
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-teal-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <label
                    htmlFor="password"
                    className="pointer-events-none absolute left-12 top-2.5 text-[11px] font-medium text-slate-500 transition-all
                      peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal
                      peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-teal-600"
                  >
                    ពាក្យសម្ងាត់
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
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
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Caps Lock ត្រូវបានបើក
                  </p>
                )}
              </div>

              {/* Remember + forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-600">ចងចាំខ្ញុំ</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors"
                  onClick={() =>
                    setError('សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin) ដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ')
                  }
                >
                  ភ្លេចពាក្យសម្ងាត់?
                </button>
              </div>

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
                className="group w-full h-14 mt-2 bg-slate-900 hover:bg-teal-700 text-white text-[15px] font-semibold rounded-2xl shadow-xl shadow-slate-900/15 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>កំពុងផ្ទៀងផ្ទាត់...</span>
                  </>
                ) : (
                  <>
                    <span>ចូលប្រើប្រាស់</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure &amp; encrypted · System v1.0</span>
            </div>
          </div>
        </main>

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
          @keyframes formIn {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .form-in { animation: formIn .55s cubic-bezier(.2,.8,.2,1) both; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .error-in { animation: fadeIn .2s ease-out; }
          @keyframes drift {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50%      { transform: translate(-24px, 28px) scale(1.06); }
          }
          .orb   { animation: drift 16s ease-in-out infinite; }
          .orb-2 { animation-duration: 21s; animation-direction: reverse; }
          @media (prefers-reduced-motion: reduce) {
            .orb, .form-in { animation: none; }
          }
        `}</style>
      </div>
    </>
  )
}