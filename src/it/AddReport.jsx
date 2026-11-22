 import React, { useState } from 'react'
import { Save, ArrowLeft, CheckCircle, X, AlertTriangle, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DepartmentSelect from '../components/DepartmentSelect'
import DatePicker from '../components/DatePicker'

export default function NewReportPage() {
  const navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  // --- States ---
  const [formData, setFormData] = useState({
    department: '',
    report_date: new Date().toISOString().split('T')[0],
    new_patient_total: 0, new_patient_female: 0,
    discharge_total: 0, discharge_female: 0,
    old_patient_total: 0, old_patient_female: 0,
    transfer_out_total: 0, transfer_out_female: 0,
    transfer_in_total: 0, transfer_in_female: 0,
    critical_total: 0, critical_female: 0,
    death_total: 0, death_female: 0,
    escape_total: 0, escape_female: 0,
    transfer_from_other_total: 0, transfer_from_other_female: 0,
    transfer_to_other_total: 0, transfer_to_other_female: 0,
    total:0, total_female:0
  })

  const [loading, setLoading] = useState(false)
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'success', title: '', message: '' })

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const showAlert = (type, title, message) => {
    setAlertConfig({ isOpen: true, type, title, message })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true) // Start Loading
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        showAlert('success', 'ជោគជ័យ', "បញ្ចូលទិន្នន័យបានជោគជ័យ!")
        setTimeout(() => navigate('/it-view'), 2000)
      } else {
        const errData = await res.json()
        throw new Error(errData.message || "Action failed")
      }
    } catch (err) {
      showAlert('error', 'បរាជ័យ', err.message)
    } finally {
      setLoading(false) // Stop Loading
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-khmer relative">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-blue-900">បញ្ចូលរបាយការណ៍ថ្មី</h1>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border">
        <div className="bg-green-700 p-4 text-white">
          <p className="text-sm opacity-90">សូមបំពេញព័ត៌មានតាមផ្នែកនីមួយៗឱ្យបានត្រឹមត្រូវ</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Top Row: Dept & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-6 border-b">
            <div>
              <DepartmentSelect
                label="ឈ្មោះផ្នែក (Department)"
                name="department" 
                value={formData.department} 
                onChange={handleInputChange} 
                required 
                disabled={loading}
              />
            </div>
            <div>
              <DatePicker
                label="ថ្ងៃរបាយការណ៍"
                name="report_date" 
                value={formData.report_date} 
                onChange={handleInputChange} 
                required 
                disabled={loading}
              />
            </div>
          </div>

          {/* Numeric Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { label: "ចូលថ្មី (New)", t: "new_patient_total", f: "new_patient_female" },
              { label: "ចេញពេទ្យ (Discharge)", t: "discharge_total", f: "discharge_female" },
              { label: "ជំងឺចាស់ (Old)", t: "old_patient_total", f: "old_patient_female" },
              { label: "បញ្ជូនចេញ (Transfer Out)", t: "transfer_out_total", f: "transfer_out_female" },
              { label: "បញ្ជូនចូល (Transfer In)", t: "transfer_in_total", f: "transfer_in_female" },
              { label: "ធ្ងន់ (Critical)", t: "critical_total", f: "critical_female" },
              { label: "ស្លាប់ (Death)", t: "death_total", f: "death_female" },
              { label: "រត់ (Escape)", t: "escape_total", f: "escape_female" },
              { label: "បញ្ជូនពីផ្នែកផ្សេង", t: "transfer_from_other_total", f: "transfer_from_other_female" },
              { label: "បញ្ជូនទៅផ្នែកផ្សេង", t: "transfer_to_other_total", f: "transfer_to_other_female" },
              { label: "សរុបអ្នកជំងឺក្នុងផ្នែក", t: "total", f: "total_female" },

            ].map((item) => (
              <div key={item.t} className="p-4 border rounded-xl bg-gray-50 hover:shadow-inner transition-all">
                <label className="block text-sm font-bold text-blue-900 mb-3 border-b pb-2">{item.label}</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">សរុប</span>
                    <input 
                      type="number" 
                      name={item.t} 
                      value={formData[item.t]} 
                      onChange={handleInputChange} 
                      disabled={loading}
                      className="w-full border p-2 rounded-lg bg-white text-center font-bold text-lg focus:ring-2 focus:ring-blue-300 outline-none disabled:opacity-70" 
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-pink-500 font-bold uppercase">ស្រី</span>
                    <input 
                      type="number" 
                      name={item.f} 
                      value={formData[item.f]} 
                      onChange={handleInputChange} 
                      disabled={loading}
                      className="w-full border-pink-100 p-2 rounded-lg bg-pink-50 text-center font-bold text-lg focus:ring-2 focus:ring-pink-300 outline-none disabled:opacity-70" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 border-t pt-6">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              disabled={loading}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              បោះបង់
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-10 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 flex items-center gap-2 transition-all transform active:scale-95 disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> កំពុងបញ្ជូន...
                </>
              ) : (
                <>
                  <Save size={20} /> បញ្ជូនទិន្នន័យ
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* --- ADDED: Full Screen Loading Overlay --- */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-in zoom-in duration-200">
            <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-800">កំពុងដំណើរការ...</h3>
            <p className="text-gray-500 mt-2">សូមមេត្តារង់ចាំមួយភ្លែត</p>
          </div>
        </div>
      )}

      {/* Reusable Alert Modal */}
      {alertConfig.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in zoom-in duration-200">
            <div className="flex justify-center mb-4">
              {alertConfig.type === 'success' ? (
                <CheckCircle className="text-green-500" size={64} />
              ) : (
                <AlertTriangle className="text-red-500" size={64} />
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{alertConfig.title}</h3>
            <p className="text-gray-600 mb-6">{alertConfig.message}</p>
            <button 
              onClick={() => setAlertConfig({ ...alertConfig, isOpen: false })}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              យល់ព្រម
            </button>
          </div>
        </div>
      )}
    </div>
  )
}