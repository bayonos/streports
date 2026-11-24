import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const LOGO_URL =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_fgi0UISkom4bjWqZ_6wxI_CEyykZD04BEEDq2ZwI56F-pK-04GtEIBoc&s=10'

const FEATURES = [
  {
    title: 'គ្រប់គ្រងទិន្នន័យអ្នកជំងឺ',
    desc: 'កត់ត្រា និងតាមដានទិន្នន័យបានរហ័ស',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    title: 'របាយការណ៍ប្រចាំថ្ងៃ',
    desc: 'សង្ខេប និងនាំចេញរបាយការណ៍ងាយស្រួល',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    title: 'សុវត្ថិភាពទិន្នន័យ',
    desc: 'ការពារព័ត៌មាន និងគណនីអ្នកប្រើប្រាស់',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
]

function Icon({ path, className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

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
        setError(data.message || 'ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ')
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
        className={`h-full w-full object-contain ${className}`}
        onError={() => setLogoError(true)}
      />
    ) : (
      <svg
        className={`h-full w-full text-teal-600 ${className}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    )

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="hospital-login min-h-screen w-full bg-[#f4f7fa] p-0 antialiased lg:p-5">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] overflow-hidden bg-white shadow-none lg:min-h-[calc(100vh-40px)] lg:rounded-[28px] lg:shadow-[0_24px_80px_rgba(15,35,55,0.10)]">
          {/* Brand and information panel */}
          <aside className="login-showcase relative hidden w-[50%] overflow-hidden text-white lg:flex xl:w-[54%]">
            <div className="showcase-grid absolute inset-0 opacity-[0.13]" />
            <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full border border-white/10" />
            <div className="absolute -right-16 -top-16 h-[390px] w-[390px] rounded-full border border-white/10" />
            <div className="absolute -bottom-48 -left-36 h-[520px] w-[520px] rounded-full bg-teal-400/10 blur-3xl" />

            <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14 2xl:p-16">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-black/10">
                  <Logo />
                </div>
                <div>
                  <p className="text-base font-semibold tracking-wide">
                    មន្ទីរពេទ្យខេត្តស្ទឹងត្រែង
                  </p>
                  <p className="mt-1 text-xs tracking-[0.12em] text-teal-100/70">
                    STUNG TRENG PROVINCIAL HOSPITAL
                  </p>
                </div>
              </div>

              <div className="max-w-xl py-12">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200/20 bg-white/[0.08] px-4 py-2 text-xs font-medium text-teal-100 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  ប្រព័ន្ធដំណើរការជាធម្មតា
                </div>

                <p className="mb-4 text-sm font-medium tracking-[0.22em] text-teal-200/80">
                  HOSPITAL INFORMATION SYSTEM
                </p>
                <h1 className="text-4xl font-bold leading-[1.45] tracking-tight xl:text-[46px]">
                  ប្រព័ន្ធគ្រប់គ្រង
                  <span className="mt-1 block text-teal-300">របាយការណ៍ប្រចាំថ្ងៃ</span>
                </h1>
                <p className="mt-6 max-w-lg text-[15px] leading-8 text-slate-200/75">
                  គ្រប់គ្រងទិន្នន័យអ្នកជំងឺ ឯកសារ និងរបាយការណ៍សុខាភិបាល
                  នៅមន្ទីរពេទ្យខេត្តស្ទឹងត្រែង ក្នុងប្រព័ន្ធតែមួយ។
                </p>

                <div className="mt-10 space-y-3">
                  {FEATURES.map((feature) => (
                    <div
                      key={feature.title}
                      className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.055] px-4 py-4 backdrop-blur-sm transition duration-300 hover:border-teal-300/30 hover:bg-white/[0.09]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-300/10 text-teal-200 ring-1 ring-teal-200/10 transition group-hover:bg-teal-300/15">
                        <Icon path={feature.icon} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{feature.title}</p>
                        <p className="mt-1 text-xs text-slate-300/65">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[11px] text-slate-300/45">
                <span>© {new Date().getFullYear()} Stung Treng Provincial Hospital</span>
                <span>HIS · Secure Access</span>
              </div>
            </div>
          </aside>

          {/* Login form */}
          <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
            <div className="login-form-enter w-full max-w-[420px]">
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm">
                  <Logo />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    មន្ទីរពេទ្យខេត្តស្ទឹងត្រែង
                  </p>
                  <p className="mt-0.5 text-[10px] tracking-wider text-slate-500">
                    STUNG TRENG PROVINCIAL HOSPITAL
                  </p>
                </div>
              </div>

              <div className="mb-9">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <Icon
                    className="h-6 w-6"
                    path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Welcome Back
                </p>
                <h2 className="text-[32px] font-bold leading-tight tracking-tight text-slate-900">
                  សូមស្វាគមន៍
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  សូមបញ្ចូលព័ត៌មានគណនីរបស់អ្នក ដើម្បីចូលទៅកាន់ផ្ទាំងគ្រប់គ្រង។
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    ឈ្មោះអ្នកប្រើប្រាស់
                  </label>
                  <div className="group relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-teal-700">
                      <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                      placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
                      className="h-[54px] w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    ពាក្យសម្ងាត់
                  </label>
                  <div className="group relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-teal-700">
                      <Icon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
                      placeholder="បញ្ចូលពាក្យសម្ងាត់"
                      className="h-[54px] w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <Icon path="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c4.5 0 8.3 2.9 9.5 7a10.8 10.8 0 01-3.1 4.6M6.2 6.2A10.8 10.8 0 002.5 12c.6 2 1.9 3.7 3.7 5M14.1 18.7A10.7 10.7 0 0112 19c-1.2 0-2.3-.2-3.3-.6" />
                      ) : (
                        <Icon path="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      )}
                    </button>
                  </div>
                  {capsLock && (
                    <p className="mt-2 text-xs font-medium text-amber-600">
                      Caps Lock ត្រូវបានបើក
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-700 accent-teal-700 focus:ring-teal-600"
                    />
                    ចងចាំខ្ញុំ
                  </label>
                  <button
                    type="button"
                    className="text-sm font-semibold text-teal-700 transition hover:text-teal-900"
                    onClick={() =>
                      setError('សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin) ដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ')
                    }
                  >
                    ភ្លេចពាក្យសម្ងាត់?
                  </button>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                  >
                    <Icon
                      className="mt-0.5 h-5 w-5 shrink-0"
                      path="M12 9v4m0 4h.01M10.3 3.9L2.6 17.2A2 2 0 004.3 20h15.4a2 2 0 001.7-2.8L13.7 3.9a2 2 0 00-3.4 0z"
                    />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group mt-2 flex h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-[#087f78] px-5 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#066b65] hover:shadow-xl hover:shadow-teal-900/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
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
                          className="opacity-90"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
                        />
                      </svg>
                      កំពុងផ្ទៀងផ្ទាត់...
                    </>
                  ) : (
                    <>
                      ចូលប្រើប្រាស់
                      <Icon
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        path="M5 12h14m-7-7l7 7-7 7"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-9 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <Icon
                  className="h-4 w-4"
                  path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
                <span>Secure &amp; encrypted · System v1.0</span>
              </div>

              <p className="mt-8 text-center text-[10px] text-slate-300 lg:hidden">
                © {new Date().getFullYear()} Stung Treng Provincial Hospital
              </p>
            </div>
          </main>
        </div>

        <style>{`
          .hospital-login {
            font-family: "Kantumruy Pro", sans-serif;
            font-optical-sizing: auto;
          }
          .hospital-login input,
          .hospital-login button,
          .hospital-login label {
            font-family: inherit;
          }
          .login-showcase {
            background:
              radial-gradient(ellipse at 12% 10%, rgba(13, 148, 136, .22), transparent 38%),
              linear-gradient(145deg, #092c3b 0%, #073b43 52%, #075c59 100%);
          }
          .showcase-grid {
            background-image:
              linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px);
            background-size: 46px 46px;
            mask-image: radial-gradient(ellipse at 50% 45%, black 10%, transparent 78%);
          }
          @keyframes loginEnter {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .login-form-enter {
            animation: loginEnter .55s cubic-bezier(.2,.8,.2,1) both;
          }
          @media (prefers-reduced-motion: reduce) {
            .login-form-enter { animation: none; }
            .hospital-login * { scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
          }
        `}</style>
      </div>
    </>
  )
}
