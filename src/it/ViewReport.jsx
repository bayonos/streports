
import React, { useEffect, useState } from 'react'
import { Pencil, Trash2, X, Save, Plus, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import DepartmentSelect from '../components/DepartmentSelect'
import DatePicker from '../components/DatePicker'

// ✅ API BASE URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function ManageReportPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false) // For GET
  const [submitting, setSubmitting] = useState(false) // For POST/PUT/DELETE
  const [error, setError] = useState(null)

  const [department, setDepartment] = useState('')
  const [date, setDate] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalReports, setTotalReports] = useState(0)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [formData, setFormData] = useState({})

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false, type: 'success', title: '', message: '', onConfirm: null
  })

  const initialFormState = {
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
    total: 0, total_female: 0
  }

  useEffect(() => {
    fetchReports()
  }, [department, date, page])

  const showAlert = (type, title, message, onConfirm = null) => {
    setAlertConfig({ isOpen: true, type, title, message, onConfirm })
  }

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }))

  // --- FETCH (GET) ---
  async function fetchReports() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (department) params.append('department', department)
      if (date) params.append('date', date)
      params.append('page', String(page))
      params.append('pageSize', String(pageSize))

      const res = await fetch(`${API_BASE_URL}/api/reports?${params.toString()}`)
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || `Fetch failed (${res.status})`)
      }
      const data = await res.json()

      // Handle new response structure { data: [], total: 0 }
      if (data && Array.isArray(data.data)) {
        setReports(data.data)
        setTotalReports(data.total || 0)
      } else if (Array.isArray(data)) {
        // Fallback for old API if needed (though we updated it)
        setReports(data)
        setTotalReports(data.length)
      } else {
        setReports([])
        setTotalReports(0)
      }
    } catch (err) {
      setError(err.message || 'Error fetching reports')
    } finally {
      setLoading(false)
    }
  }

  // --- SUBMIT (POST / PUT) ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const url = modalMode === 'edit'
      ? `${API_BASE_URL}/api/reports/${formData.id}`
      : `${API_BASE_URL}/api/reports`
    const method = modalMode === 'edit' ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Action failed')
      }

      setIsModalOpen(false)
      showAlert('success', 'ជោគជ័យ', modalMode === 'edit' ? 'កែប្រែបានជោគជ័យ!' : 'បញ្ចូលទិន្នន័យបានជោគជ័យ!')
      fetchReports()
    } catch (err) {
      showAlert('error', 'បរាជ័យ', err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // --- DELETE ---
  const handleDelete = (id) => {
    showAlert('warning', 'បញ្ជាក់ការលុប', 'តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?', async () => {
      setSubmitting(true)
      closeAlert() // Close warning modal immediately to show process
      try {
        const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Delete failed')
        fetchReports()
      } catch (err) {
        showAlert('error', 'Error', err.message)
      } finally {
        setSubmitting(false)
      }
    })
  }

  const handleAddNew = () => { setFormData(initialFormState); setModalMode('add'); setIsModalOpen(true) }
  const handleEditClick = (report) => { setFormData({ ...report }); setModalMode('edit'); setIsModalOpen(true) }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function calcTotal(r) {
    return (Number(r.new_patient_total) || 0) + (Number(r.old_patient_total) || 0) + (Number(r.transfer_in_total) || 0)
  }

  // Pagination Logic
  const totalPages = Math.ceil(totalReports / pageSize)
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const pageNumbers = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : page <= 3
      ? [1, 2, 3, 'ellipsis-end', totalPages]
      : page >= totalPages - 2
        ? [1, 'ellipsis-start', totalPages - 2, totalPages - 1, totalPages]
        : [1, 'ellipsis-start', page - 1, page, page + 1, 'ellipsis-end', totalPages]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Global Submitting Overlay for Delete/Actions */}
      {submitting && !isModalOpen && (
        <div className="fixed inset-0 bg-white/50 z-[110] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <span className="font-bold text-blue-900">កំពុងដំណើរការ...</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-blue-900">គ្រប់គ្រងរបាយការណ៍ពេលរសៀល</h1>
        <button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all font-bold">
          <Plus size={20} /> បន្ថែមថ្មី
        </button>
      </div>

      {/* Alert Modal */}
      {alertConfig.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                {alertConfig.type === 'success' && <CheckCircle className="text-green-500" size={60} />}
                {alertConfig.type === 'error' && <X className="text-red-500 border-4 border-red-500 rounded-full p-2" size={60} />}
                {alertConfig.type === 'warning' && <AlertTriangle className="text-yellow-500" size={60} />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{alertConfig.title}</h3>
              <p className="text-gray-600">{alertConfig.message}</p>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-center gap-3">
              {alertConfig.onConfirm ? (
                <>
                  <button onClick={closeAlert} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">បោះបង់</button>
                  <button onClick={alertConfig.onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">យល់ព្រមលុប</button>
                </>
              ) : (
                <button onClick={closeAlert} className="px-8 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 transition-colors shadow-md">យល់ព្រម</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 bg-white p-4 rounded shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">ស្វែងរកតាមផ្នែក</label>
          <DepartmentSelect value={department} includeAll onChange={e => { setPage(1); setDepartment(e.target.value) }} className="md:w-64" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ថ្ងៃរបាយការណ៍</label>
          <DatePicker value={date} onChange={e => { setPage(1); setDate(e.target.value) }} className="md:w-48" />
        </div>
      </div>

      {loading &&
        <div className="fixed inset-0 bg-white/50 z-[110] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <span className="font-bold text-blue-900">កំពុងទាញយកទិន្នន័យ...</span>
          </div>
        </div>
      }
      {error && <div className="text-red-600 mb-4 bg-red-50 p-3 rounded border border-red-200">{error}</div>}

      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-3 py-3 text-left">ផ្នែក</th>
              <th className="px-2 py-3 text-center">ចូលថ្មី</th>
              <th className="px-2 py-3 text-center">ចេញពេទ្យ</th>
              <th className="px-2 py-3 text-center">ជំងឺចាស់</th>
              <th className="px-2 py-3 text-center">បញ្ជូនចេញ</th>
              <th className="px-2 py-3 text-center">បញ្ជូនចូល</th>
              <th className="px-2 py-3 text-center">ធ្ងន់</th>
              <th className="px-2 py-3 text-center">ស្លាប់</th>
              <th className="px-2 py-3 text-center">រត់</th>
              <th className="px-2 py-3 text-center font-bold">សរុប</th>
              <th className="px-3 py-3 text-left">ថ្ងៃរបាយការណ៍</th>
              <th className="px-3 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.length === 0 && !loading && (
              <tr><td colSpan={12} className="px-3 py-10 text-center text-gray-400">មិនមានទិន្នន័យឡើយ</td></tr>
            )}
            {reports.map((r, idx) => (
              <tr key={r.id ?? idx} className="hover:bg-blue-50 transition-colors">
                <td className="px-3 py-3 font-medium text-gray-900">{r.department}</td>
                <td className="px-2 py-3 text-center">{r.new_patient_total ?? 0}</td>
                <td className="px-2 py-3 text-center">{r.discharge_total ?? 0}</td>
                <td className="px-2 py-3 text-center">{r.old_patient_total ?? 0}</td>
                <td className="px-2 py-3 text-center">{r.transfer_out_total ?? 0}</td>
                <td className="px-2 py-3 text-center">{r.transfer_in_total ?? 0}</td>
                <td className="px-2 py-3 text-center">{r.critical_total ?? 0}</td>
                <td className="px-2 py-3 text-center font-medium text-red-600">{r.death_total ?? 0}</td>
                <td className="px-2 py-3 text-center">{r.escape_total ?? 0}</td>
                <td className="px-2 py-3 text-center font-bold text-blue-700 bg-blue-50/50">{r.total}</td>
                <td className="px-3 py-3 whitespace-nowrap text-gray-600">{r.report_date}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEditClick(r)} className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(r.id)} className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalReports > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4 text-sm text-gray-600">
          <div>
            Showing <span className="font-semibold">{(page - 1) * pageSize + 1}</span> to <span className="font-semibold">{Math.min(page * pageSize, totalReports)}</span> of <span className="font-semibold">{totalReports}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex flex-wrap gap-1 max-w-full">
              {pageNumbers.map((pageNumber) => pageNumber.toString().startsWith('ellipsis') ? (
                <span key={pageNumber} className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 border rounded ${page === pageNumber ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className={`flex justify-between items-center p-4 border-b text-white ${modalMode === 'edit' ? 'bg-blue-900' : 'bg-green-700'}`}>
              <h2 className="text-lg font-bold">{modalMode === 'edit' ? `កែប្រែរបាយការណ៍ - ${formData.department}` : 'បន្ថែមរបាយការណ៍ថ្មី'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:opacity-70 p-1 transition-colors"><X size={24} /></button>
            </div>

            <form id="reportForm" onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ឈ្មោះផ្នែក</label>
                  <DepartmentSelect name="department" value={formData.department} onChange={handleInputChange} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ថ្ងៃរបាយការណ៍</label>
                  <DatePicker name="report_date" value={formData.report_date} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <div key={item.t} className="p-3 border rounded-lg bg-gray-50">
                    <label className="block text-sm font-bold text-blue-800 mb-2 border-b pb-1">{item.label}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="text-[10px] text-gray-400 font-bold uppercase">សរុប</span>
                        <input type="number" name={item.t} value={formData[item.t] ?? 0} onChange={handleInputChange} className="w-full border p-1.5 rounded bg-white text-center" /></div>
                      <div><span className="text-[10px] text-pink-500 font-bold uppercase">ស្រី</span>
                        <input type="number" name={item.f} value={formData[item.f] ?? 0} onChange={handleInputChange} className="w-full border border-pink-100 p-1.5 rounded bg-pink-50 text-center" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </form>

            <div className="p-4 border-t bg-gray-100 flex justify-end gap-3">
              <button type="button" disabled={submitting} onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-white border border-gray-300 rounded-lg font-medium">បោះបង់</button>
              <button type="submit" form="reportForm" disabled={submitting} className={`px-6 py-2 text-white rounded-lg flex items-center gap-2 font-bold shadow-md disabled:opacity-50 ${modalMode === 'edit' ? 'bg-blue-600' : 'bg-green-600'}`}>
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {modalMode === 'edit' ? 'រក្សាទុកទិន្នន័យ' : 'បញ្ជូនទិន្នន័យ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}