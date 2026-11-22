import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false) // New Loading State

  const location = useLocation()
  const from = location.state?.from?.pathname || "/dashboard"

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // Start loading

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password
        })
      });

      const data = await res.json();

      if (data.success === true) {
        onLogin(data.username, from);
      } else {
        setError(data.message || 'ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ');
      }
    } catch (err) {
      setError('មិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេបានទេ (Connection Error)');
      console.error("Login Fetch Error:", err);
    } finally {
      setIsLoading(false); // Stop loading regardless of success/fail
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 bg-gradient-to-br from-blue-50 to-white font-khmer">
      <div className="w-full max-w-sm bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
          <h3 className="text-3xl font-bold text-gray-500 mb-2">មន្ទីរពេទ្យខេត្តស្ទឹងត្រែង</h3>
          {/* <p className="text-sm text-gray-500">បញ្ចូលគណនីរបស់អ្នកដើម្បីបន្ត</p> */}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:opacity-50"
              placeholder="Enter your email or username"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-200 transition-all transform active:scale-[0.98] mt-2 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                កំពុងផ្ទៀងផ្ទាត់...
              </>
            ) : (
              'ចូលប្រើប្រាស់'
            )}
          </button>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg text-center border border-red-100">
              {error}
            </div>
          )}
        </form>

        <div className="text-center text-[10px] text-gray-400 mt-8 uppercase tracking-widest">
          System v1.0 • Hospital Management
        </div>
      </div>
    </div>
  )
}