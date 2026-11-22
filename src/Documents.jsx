import React, { useState, useEffect } from 'react'
import { FileText, Upload, Folder, Search, Loader2, Trash2, CheckCircle2, X, AlertCircle, FileSpreadsheet, FileImage, FileCode, FileLineChart, Download } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
console.log('API URL:', API_BASE_URL)

const DEPARTMENTS = [
    "General",
    "ផ្នែកសម្ភព និងរោគស្ត្រី", "ផ្នែករបួស និងវះកាត់", "ផ្នែកសង្គ្រោះបន្ទាន់",
    "ផ្នែកជំងឺទូទៅ", "ផ្នែកជំងឺកុមារ", "ផ្នែកជំងឺរបេង", "ផ្នែកចក្ខុរោគ", "ផ្នែកថែទាំទារក"
]

export default function DocumentsPage() {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [department, setDepartment] = useState('')
    const [filterDept, setFilterDept] = useState('')
    const [filterDate, setFilterDate] = useState('')
    const [note, setNote] = useState('')
    const [selectedFiles, setSelectedFiles] = useState([])
    const [selectedDocIds, setSelectedDocIds] = useState([])
    const [deleting, setDeleting] = useState(false)
    const [showModal, setShowModal] = useState(false)

    // New Modal States
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, ids: [] })
    const [successModal, setSuccessModal] = useState({ show: false, message: '', type: 'success' })

    // Fetch documents
    const fetchDocuments = async () => {
        setLoading(true)
        try {
            const url = new URL(`${API_BASE_URL}/api/documents`)
            if (filterDept) url.searchParams.append('department', filterDept)
            if (filterDate) url.searchParams.append('date', filterDate)

            const res = await fetch(url)
            const data = await res.json()
            if (data.success) {
                setDocuments(data.data)
            } else {
                console.error('Failed to fetch:', data.message)
            }
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [filterDept, filterDate])

    // Handle Upload
    const handleUpload = async (e) => {
        e.preventDefault()
        if (selectedFiles.length === 0) return

        setUploading(true)
        const formData = new FormData()
        // Append each file
        selectedFiles.forEach(file => {
            formData.append('files', file)
        })
        formData.append('department', department || 'General')
        // Send the same note for all files in this batch
        formData.append('notes', JSON.stringify(Array(selectedFiles.length).fill(note)))

        try {
            const res = await fetch(`${API_BASE_URL}/api/documents`, {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.success) {
                setSelectedFiles([])
                setDepartment('')
                setNote('')
                setShowModal(false)
                // Reset file input
                if (document.getElementById('fileInput')) document.getElementById('fileInput').value = ''
                fetchDocuments()
                setSuccessModal({ show: true, message: data.message || 'បានរក្សាទុកដោយជោគជ័យ', type: 'success' })
            } else {
                setSuccessModal({ show: true, message: 'បរាជ័យ: ' + data.message, type: 'error' })
            }
        } catch (err) {
            setSuccessModal({ show: true, message: 'មានកំហុស: ' + err.message, type: 'error' })
        } finally {
            setUploading(false)
        }
    }

    const removeSelectedFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index)
        setSelectedFiles(newFiles)
        if (newFiles.length === 0) {
            setShowModal(false)
            setNote('')
        }
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files])
            setShowModal(true)
        }
    }

    const closeModal = () => {
        if (!uploading) {
            setShowModal(false)
            setSelectedFiles([])
            setDepartment('')
            setNote('')
            if (document.getElementById('fileInput')) document.getElementById('fileInput').value = ''
        }
    }

    // Handle Delete
    const handleDelete = async (ids) => {
        setDeleteConfirm({ show: false, ids: [] })
        setDeleting(true)
        try {
            const res = await fetch(`${API_BASE_URL}/api/documents`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids })
            })
            const data = await res.json()
            if (data.success) {
                setSelectedDocIds([])
                fetchDocuments()
                setSuccessModal({ show: true, message: `បានលុបឯកសារចំនួន ${ids.length} ដោយជោគជ័យ`, type: 'success' })
            } else {
                setSuccessModal({ show: true, message: 'ការលុបបរាជ័យ: ' + data.message, type: 'error' })
            }
        } catch (err) {
            setSuccessModal({ show: true, message: 'មានកំហុស: ' + err.message, type: 'error' })
        } finally {
            setDeleting(false)
        }
    }

    const handleDownloadZip = () => {
        if (selectedDocIds.length === 0) return
        const ids = selectedDocIds.join(',')
        window.location.href = `${API_BASE_URL}/api/documents/download-zip?ids=${ids}`
    }

    const openDeleteConfirm = (ids) => {
        setDeleteConfirm({ show: true, ids })
    }

    const toggleSelectDoc = (id) => {
        setSelectedDocIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    // Helper to get Icon and Color for file types
    const getFileInfo = (doc) => {
        const type = doc.file_type?.toLowerCase() || ''
        const name = doc.file_name?.toLowerCase() || ''

        if (type.startsWith('image/')) return { icon: <FileImage size={64} />, color: 'text-purple-500', bg: 'bg-purple-50' }
        if (type.includes('pdf') || name.endsWith('.pdf')) return { icon: <FileText size={64} />, color: 'text-red-500', bg: 'bg-red-50' }
        if (type.includes('spreadsheet') || type.includes('excel') || name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')) {
            return { icon: <FileSpreadsheet size={64} />, color: 'text-green-600', bg: 'bg-green-50' }
        }
        if (type.includes('word') || type.includes('officedocument.wordprocessingml') || name.endsWith('.docx') || name.endsWith('.doc')) {
            return { icon: <FileText size={64} />, color: 'text-blue-600', bg: 'bg-blue-50' }
        }
        if (type.includes('presentation') || name.endsWith('.pptx') || name.endsWith('.ppt')) {
            return { icon: <FileText size={64} />, color: 'text-orange-500', bg: 'bg-orange-50' }
        }
        if (type.includes('zip') || type.includes('rar')) return { icon: <Folder size={64} />, color: 'text-yellow-600', bg: 'bg-yellow-50' }

        return { icon: <FileText size={64} />, color: 'text-gray-400', bg: 'bg-gray-50' }
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-semibold text-green-700 flex items-center gap-2">
                    <Folder size={28} /> គ្រប់គ្រងឯកសារ (Documents)
                </h1>


            </div>

            {/* Upload Trigger Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Upload size={20} className="text-blue-600" /> បញ្ចូលឯកសារថ្មី
                    </h2>
                    <p className="text-sm text-gray-500">ជ្រើសរើសឯកសារដើម្បីចាប់ផ្តើមការបញ្ចូល (Select files to start uploading)</p>
                </div>

                <div className="relative">
                    <input
                        id="fileInput"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-bold shadow-md transition-all">
                        <Upload size={20} /> ជ្រើសរើសឯកសារ (Select Files)
                    </button>
                </div>
            </div>

            {/* Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Upload size={20} className="text-blue-600" /> រៀបចំការបញ្ចូលឯកសារ (Upload Staging)
                            </h3>
                            <button
                                onClick={closeModal}
                                disabled={uploading}
                                className={`p-1 rounded-full transition-colors ${uploading ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                                        <AlertCircle size={16} className="text-orange-500" />
                                        សូមជ្រើសរើសផ្នែក (Select Department) <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:border-blue-500 bg-white transition-all text-gray-800"
                                    >
                                        <option value="">-- សូមជ្រើសរើសផ្នែក --</option>
                                        {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2 text-gray-700 flex items-center gap-2">
                                        <FileText size={16} className="text-blue-400" />
                                        កំណត់ចំណាំ (Note)
                                    </label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="បន្ថែមចំណាំសម្រាប់ឯកសារទាំងនេះ... (Add a note for these files...)"
                                        rows={2}
                                        className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:border-blue-500 bg-white transition-all text-gray-800 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <FileText size={16} className="text-gray-400" />
                                    ឯកសារដែលបានជ្រើសរើស ({selectedFiles.length}):
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <FileText size={20} className="text-blue-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-800 truncate max-w-[300px]" title={file.name}>{file.name}</span>
                                                    <span className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSelectedFile(index)}
                                                disabled={uploading}
                                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                disabled={uploading}
                                className={`px-6 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-600 transition-all flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-gray-100'}`}
                            >
                                បោះបង់ (Cancel)
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={uploading || selectedFiles.length === 0 || !department}
                                className={`px-8 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg transition-all text-white ${uploading || selectedFiles.length === 0 || !department ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95'}`}
                            >
                                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                                រក្សាទុក ({selectedFiles.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid View */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 border-b pb-2">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FileText size={20} className="text-gray-500" /> បញ្ជីឯកសារ
                </h2>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {selectedDocIds.length > 0 && (
                        <button
                            onClick={handleDownloadZip}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all font-bold animate-in fade-in slide-in-from-right-4"
                        >
                            <Download size={20} />
                            ទាញយកដែលបានជ្រើសរើស ({selectedDocIds.length})
                        </button>
                    )}
                    {selectedDocIds.length > 0 && (
                        <button
                            onClick={() => openDeleteConfirm(selectedDocIds)}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all font-bold animate-in fade-in slide-in-from-right-4"
                        >
                            {deleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                            លុបដែលបានជ្រើសរើស ({selectedDocIds.length})
                        </button>
                    )}
                    {/* Department Filter */}
                    <div className="flex items-center gap-2 bg-white border rounded-lg px-2 py-1 shadow-sm">
                        <Folder size={16} className="text-gray-400" />
                        <select
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                            className="bg-transparent text-sm outline-none border-none py-1 cursor-pointer"
                        >
                            <option value="">គ្រប់ផ្នែក (All Dept)</option>
                            {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div className="flex items-center gap-2 bg-white border rounded-lg px-2 py-1 shadow-sm">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="bg-transparent text-sm outline-none border-none py-1 cursor-pointer"
                        />
                        {filterDate && (
                            <button
                                onClick={() => setFilterDate('')}
                                className="text-gray-400 hover:text-red-500 p-1"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-green-600" size={40} />
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed">
                    មិនមានឯកសារឡើយ (No documents found)
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {documents.map((doc) => {
                        // Construct full URL if path is relative
                        const fileUrl = doc.file_path.startsWith('http') ? doc.file_path : `${API_BASE_URL}${doc.file_path}`
                        const isImage = doc.file_type && doc.file_type.startsWith('image/')
                        const isSelected = selectedDocIds.includes(doc.id)

                        return (
                            <div key={doc.id} className="relative group">
                                {/* Checkbox */}
                                <div
                                    onClick={() => toggleSelectDoc(doc.id)}
                                    className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-green-600 border-green-600 text-white' : 'bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100 hover:border-green-500'}`}
                                >
                                    {isSelected && <CheckCircle2 size={16} />}
                                </div>

                                {/* Delete Button (Individual) */}
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); openDeleteConfirm([doc.id]) }}
                                    className="absolute top-2 right-2 z-10 p-1.5 bg-red-100 text-red-600 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                    title="លុបឯកសារ"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block bg-white rounded-xl shadow-sm border transition-all overflow-hidden ${isSelected ? 'ring-2 ring-green-500 border-green-500 shadow-md' : 'border-gray-200 hover:shadow-md hover:border-green-400'}`}
                                >
                                    <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                                        {isImage ? (
                                            <img src={fileUrl} alt={doc.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={getFileInfo(doc).color}>
                                                    {getFileInfo(doc).icon}
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getFileInfo(doc).bg} ${getFileInfo(doc).color}`}>
                                                    {doc.file_name.split('.').pop()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-gray-800 truncate text-sm" title={doc.file_name}>{doc.file_name}</h3>
                                        {doc.note && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 italic" title={doc.note}>
                                                "{doc.note}"
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{doc.department}</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">បញ្ជាក់ការលុប</h3>
                            <p className="text-gray-600">តើអ្នកពិតជាចង់លុបឯកសារចំនួន <span className="font-bold text-red-600">{deleteConfirm.ids.length}</span> នេះមែនទេ?</p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-center gap-3">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, ids: [] })}
                                className="px-6 py-2 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                ទេ (No)
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm.ids)}
                                className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transition-all active:scale-95"
                            >
                                បាទ/ចាស (Yes, Delete)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success/Error Notification Modal */}
            {successModal.show && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className={`w-20 h-20 ${successModal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                {successModal.type === 'success' ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
                            </div>
                            <h3 className={`text-2xl font-bold mb-2 ${successModal.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                                {successModal.type === 'success' ? 'ជោគជ័យ!' : 'បរាជ័យ!'}
                            </h3>
                            <p className="text-gray-700 font-medium">{successModal.message}</p>
                        </div>
                        <div className="px-6 pb-6 text-center">
                            <button
                                onClick={() => setSuccessModal({ ...successModal, show: false })}
                                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${successModal.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                យល់ព្រម (OK)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
