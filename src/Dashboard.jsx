import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'
import { Loader2, Calendar } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const COLORS = ['#3b82f6', '#ec4899'] // Blue for Male, Pink for Female

export default function Dashboard({ user }) {
  const orgName = 'មន្ទីរពេទ្យខេត្តស្ទឹងត្រែង'
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [pieData, setPieData] = useState([])

  // Date Filters
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date.toISOString().split('T')[0];
  })
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  })

  async function fetchSummary() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const res = await fetch(`${API_BASE_URL}/api/reports/summary?${params.toString()}`)
      if (res.ok) {
        const result = await res.json()
        setData(result)

        // Calculate Totals for Pie Chart
        const totalPatients = result.reduce((acc, curr) => acc + (parseInt(curr.total) || 0), 0)
        const totalFemale = result.reduce((acc, curr) => acc + (parseInt(curr.female) || 0), 0)
        const totalMale = totalPatients - totalFemale

        setPieData([
          { name: 'ប្រុស (Male)', value: totalMale < 0 ? 0 : totalMale },
          { name: 'ស្រី (Female)', value: totalFemale }
        ])
      }
    } catch (err) {
      console.error("Failed to load summary", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, []) // Initial load (last 7 days)

  const handleFilter = () => {
    fetchSummary()
  }

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-50 overflow-y-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">{orgName}</h1>
        <p className="text-gray-600">សូមស្វាគមន៍, <span className="font-semibold text-blue-600">{user.username}</span>!</p>
      </div>

      {/* Date Filter Section */}
      <div className="max-w-6xl mx-auto w-full mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ថ្ងៃចាប់ផ្តើម (Start Date)</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ថ្ងៃបញ្ចប់ (End Date)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Calendar size={16} />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📊</span> សង្ខេបចំនួនអ្នកជំងឺសរុបប្រចាំថ្ងៃ
          </h2>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-blue-500">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : data.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              មិនមានទិន្នន័យ
            </div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="total" name="អ្នកជំងឺសរុប (Total)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="female" name="ស្រី (Female)" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>👥</span> សង្ខេបតាមភេទ
          </h2>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-blue-500">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : pieData.some(d => d.value > 0) === false ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              មិនមានទិន្នន័យ
            </div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Mortality Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-3">
          <h2 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
            <span>⚠️</span> សង្ខេបមរណភាព (Mortality)
          </h2>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-blue-500">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : data.every(d => (d.death || 0) === 0) ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              មិនមានទិន្នន័យមរណភាព
            </div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: '#fef2f2' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="death" name="ស្លាប់សរុប (Total Deaths)" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="death_female" name="ស្លាប់ស្រី (Female Deaths)" fill="#f97316" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
