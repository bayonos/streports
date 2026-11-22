import React, { useState } from 'react'
import { User, Shield, Bell, Save, Moon, Globe } from 'lucide-react'

export default function SettingsPage({ user }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    username: user?.username || 'Admin',
    email: 'admin@hospital.gov.kh',
    fullName: 'Administrator'
  })

  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleSave = () => {
    alert("ការកំណត់ត្រូវបានរក្សាទុក! (Settings Saved)")
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-khmer">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">ការកំណត់ (Settings)</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User size={20} /> ព័ត៌មានផ្ទាល់ខ្លួន
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'system' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Shield size={20} /> ប្រព័ន្ធ និងសុវត្ថិភាព
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border p-6">
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-lg font-bold border-b pb-4 mb-6">ព័ត៌មានគណនី</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះអ្នកប្រើប្រាស់ (Username)</label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="w-full border p-2.5 rounded-lg outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះពេញ (Full Name)</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full border p-2.5 rounded-lg outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">អ៊ីមែល (Email)</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full border p-2.5 rounded-lg outline-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-lg font-bold border-b pb-4 mb-6">ការកំណត់ប្រព័ន្ធ</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="text-blue-600" />
                      <div>
                        <p className="font-bold">ការជូនដំណឹង (Notifications)</p>
                        <p className="text-xs text-gray-500">បើកសម្រាប់ការជូនដំណឹងរបាយការណ៍ថ្មី</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications} 
                      onChange={() => setNotifications(!notifications)}
                      className="w-5 h-5 accent-blue-600"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon className="text-indigo-600" />
                      <div>
                        <p className="font-bold">មុខងារងងឹត (Dark Mode)</p>
                        <p className="text-xs text-gray-500">ប្តូរពន្លឺអេក្រង់ទៅជាពណ៌ងងឹត</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={darkMode} 
                      onChange={() => setDarkMode(!darkMode)}
                      className="w-5 h-5 accent-blue-600"
                    />
                  </div>

                  <div className="flex items-center gap-3 border-t pt-4">
                    <Globe className="text-green-600" />
                    <div className="flex-1">
                      <p className="font-bold">ភាសា (Language)</p>
                      <select className="mt-2 border p-2 rounded-lg w-full max-w-xs bg-gray-50">
                        <option>ភាសាខ្មែរ (Khmer)</option>
                        <option>English</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="mt-10 pt-6 border-t flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                <Save size={18} /> រក្សាទុកការផ្លាស់ប្តូរ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}