import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Printer, Plus, X, Save, AlertTriangle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DatePicker from '../components/DatePicker';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function MaternityReport() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Filters
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
    const [filterWeek, setFilterWeek] = useState('');
    const [page, setPage] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const pageSize = 10;

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [formData, setFormData] = useState({});

    const initialFormState = {
        week_number: 1,
        year_number: new Date().getFullYear(),
        start_date: '',
        end_date: '',
        system_single: 0, system_twins: 0, system_triplets: 0,
        system_loc_hc: 0, system_loc_dist: 0, system_loc_prov: 0, system_loc_nat: 0,
        nonsystem_single: 0, nonsystem_twins: 0, nonsystem_triplets: 0,
        nonsystem_loc_hc: 0, nonsystem_loc_dist: 0, nonsystem_loc_prov: 0, nonsystem_loc_nat: 0,
        civil_single: 0, civil_twins: 0, civil_triplets: 0,
        civil_loc_hc: 0, civil_loc_dist: 0, civil_loc_prov: 0, civil_loc_nat: 0,
        total_case: 0,
        created_by: JSON.parse(localStorage.getItem('hospital_user'))?.username || 'System'
    };

    const [alertConfig, setAlertConfig] = useState({
        isOpen: false, type: 'success', title: '', message: '', onConfirm: null
    });

    useEffect(() => {
        fetchReports();
    }, [filterYear, filterWeek, page]);

    const showAlert = (type, title, message, onConfirm = null) => {
        setAlertConfig({ isOpen: true, type, title, message, onConfirm });
    };

    const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filterYear) params.append('year', filterYear);
            if (filterWeek) params.append('week', filterWeek);
            params.append('page', String(page));
            params.append('pageSize', String(pageSize));

            const res = await fetch(`${API_BASE_URL}/api/maternity-reports?${params.toString()}`);
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setReports(data.data || []);
            setTotalReports(data.total || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const url = modalMode === 'edit'
            ? `${API_BASE_URL}/api/maternity-reports/${formData.id}`
            : `${API_BASE_URL}/api/maternity-reports`;
        const method = modalMode === 'edit' ? 'PUT' : 'POST';

        // Calculate total case before saving
        const total =
            (Number(formData.system_single) || 0) + (Number(formData.system_twins) || 0) + (Number(formData.system_triplets) || 0) +
            (Number(formData.nonsystem_single) || 0) + (Number(formData.nonsystem_twins) || 0) + (Number(formData.nonsystem_triplets) || 0) +
            (Number(formData.civil_single) || 0) + (Number(formData.civil_twins) || 0) + (Number(formData.civil_triplets) || 0);

        const finalData = { ...formData, total_case: total };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || errData.error || 'Action failed');
            }
            setIsModalOpen(false);
            showAlert('success', 'ជោគជ័យ', modalMode === 'edit' ? 'កែប្រែបានជោគជ័យ!' : 'បញ្ចូលទិន្នន័យបានជោគជ័យ!');
            fetchReports();
        } catch (err) {
            showAlert('error', 'បរាជ័យ', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        showAlert('warning', 'បញ្ជាក់ការលុប', 'តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?', async () => {
            setSubmitting(true);
            closeAlert();
            try {
                const res = await fetch(`${API_BASE_URL}/api/maternity-reports/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Delete failed');
                fetchReports();
            } catch (err) {
                showAlert('error', 'Error', err.message);
            } finally {
                setSubmitting(false);
            }
        });
    };

    const handleAddNew = () => { setFormData(initialFormState); setModalMode('add'); setIsModalOpen(true); };
    const handleEditClick = (report) => { setFormData({ ...report }); setModalMode('edit'); setIsModalOpen(true); };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrint = (report) => {
        const khmerNums = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        const khmerMonths = [
            'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
            'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
        ];
        const toKhmer = (num) => String(num).split('').map(d => khmerNums[d] || d).join('');
        const formatKhmerDate = (date) => {
            const d = new Date(date);
            return `ថ្ងៃទី ${toKhmer(d.getDate())} ខែ ${khmerMonths[d.getMonth()]} ឆ្នាំ ${toKhmer(d.getFullYear())}`;
        };

        const printWindow = window.open('', '_blank');
        const html = `
      <html>
        <head>
          <title>Print Report</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Moul&family=Noto+Serif+Khmer:wght@100..900&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Noto Serif Khmer', serif; padding: 20px 20px; color: #333; line-height: 1.4; font-size: 12px; }
            .moul { font-family: 'Moul', serif; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h3:first-child { font-size: 15px; margin-top: 60px; font-family: 'Moul', serif; font-weight: normal; }
            .header h3:last-child { font-size: 14px; margin: 2px 0; font-weight: normal; }
            .top-right { position: absolute; top: 20px; right: 40px; text-align: center; font-family: 'Moul', serif; font-size: 12px; }
            .top-left { position: absolute; top: 20px; left: 40px; text-align: left; font-family: 'Moul', serif; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th, td { border: 1px solid black; padding: 4px; text-align: center; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 20px; display: flex; justify-content: space-between; }
            .signature-box { text-align: center; width: 250px; }
            @media print {
              .no-print { display: none; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="top-left">
              <img src="http://36.37.180.54:4005/uploads/1768916357786-file_image_logo-1761054492437-153405275.png" style="height: 70px; margin-left: 10px; margin-bottom: 5px;"/><br/>
              រដ្ឋបាលខេត្តស្ទឹងត្រែង<br/>
              មន្ទីរសុខាភិបាលនៃរដ្ឋបាលខេត្ត<br/>
              មន្ទីរពេទ្យបង្អែកខេត្តស្ទឹងត្រែង
          </div>
          <div class="top-right">
              ព្រះរាជាណាចក្រកម្ពុជា<br/>
              ជាតិ សាសនា ព្រះមហាក្សត្រ<br/>
              <center><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Royal_standard_of_the_King_of_Cambodia.svg/1024px-Royal_standard_of_the_King_of_Cambodia.svg.png" style="height: 5px; width: 100px; margin-top: 5px;"/></center>
          </div>
          <br/><br/><br/><br/><br/>
          <div class="header">
            <h3>របាយការណ៍ប្រចាំសប្តាហ៍ស្ថិតិសម្រាលកូននៅមូលដ្ឋានសុខាភិបាលសាធារណៈ</h3>
            <h3>សប្តាហ៍ទី ${toKhmer(report.week_number)} ពី${formatKhmerDate(report.start_date)} ដល់${formatKhmerDate(report.end_date)}</h3>
          </div>

          <table>
            <thead>
              <tr>
                <th rowspan="2">ល.រ</th>
                <th rowspan="2">ប្រភេទស្ត្រី សម្រាលកូន</th>
                <th colspan="3">ចំនួនស្ត្រីសម្រាលកូន</th>
                <th rowspan="2">សរុប</th>
                <th colspan="4">សម្រាលនៅ</th>
              </tr>
              <tr>
                <th>កូនទោល</th>
                <th>កូនភ្លោះ២</th>
                <th>កូនភ្លោះ៣</th>
                <th>មណ្ឌលសុខភាព</th>
                <th>មន្ទីរពេទ្យ ក្រុង/ស្រុក/ខណ្ឌ</th>
                <th>មន្ទីរពេទ្យ រាជធានី/ខេត្ត</th>
                <th>មន្ទីរពេទ្យជាតិ</th>
              </tr>
            </thead>
            <tbody>
              <tr style="height: 50px;">
                <td>១</td>
                <td style="text-align: left;">កម្មការិនីនិយោជិក ជាស្ត្រីក្នុងប្រព័ន្ធ</td>
                <td>${report.system_single}</td>
                <td>${report.system_twins}</td>
                <td>${report.system_triplets}</td>
                <td>${Number(report.system_single) + Number(report.system_twins) + Number(report.system_triplets)}</td>
                <td>${report.system_loc_hc}</td>
                <td>${report.system_loc_dist}</td>
                <td>${report.system_loc_prov}</td>
                <td>${report.system_loc_nat}</td>
              </tr>
              <tr style="height: 50px;">
                <td>២</td>
                <td style="text-align: left;">កម្មការិនីនិយោជិក ជាស្ត្រីក្រៅប្រព័ន្ធ</td>
                <td>${report.nonsystem_single}</td>
                <td>${report.nonsystem_twins}</td>
                <td>${report.nonsystem_triplets}</td>
                <td>${Number(report.nonsystem_single) + Number(report.nonsystem_twins) + Number(report.nonsystem_triplets)}</td>
                <td>${report.nonsystem_loc_hc}</td>
                <td>${report.nonsystem_loc_dist}</td>
                <td>${report.nonsystem_loc_prov}</td>
                <td>${report.nonsystem_loc_nat}</td>
              </tr>
              <tr style="height: 50px;">
                <td>៣</td>
                <td style="text-align: left;">មន្ត្រីសាធារណៈជាស្ត្រី</td>
                <td>${report.civil_single}</td>
                <td>${report.civil_twins}</td>
                <td>${report.civil_triplets}</td>
                <td>${Number(report.civil_single) + Number(report.civil_twins) + Number(report.civil_triplets)}</td>
                <td>${report.civil_loc_hc}</td>
                <td>${report.civil_loc_dist}</td>
                <td>${report.civil_loc_prov}</td>
                <td>${report.civil_loc_nat}</td>
              </tr>
              <tr style="background-color: #f2f2f2; font-weight: bold; height: 50px;">
                <td colspan="2">សរុប (១+២+៣)</td>
                <td>${Number(report.system_single) + Number(report.nonsystem_single) + Number(report.civil_single)}</td>
                <td>${Number(report.system_twins) + Number(report.nonsystem_twins) + Number(report.civil_twins)}</td>
                <td>${Number(report.system_triplets) + Number(report.nonsystem_triplets) + Number(report.civil_triplets)}</td>
                <td>${report.total_case}</td>
                <td>${Number(report.system_loc_hc) + Number(report.nonsystem_loc_hc) + Number(report.civil_loc_hc)}</td>
                <td>${Number(report.system_loc_dist) + Number(report.nonsystem_loc_dist) + Number(report.civil_loc_dist)}</td>
                <td>${Number(report.system_loc_prov) + Number(report.nonsystem_loc_prov) + Number(report.civil_loc_prov)}</td>
                <td>${Number(report.system_loc_nat) + Number(report.nonsystem_loc_nat) + Number(report.civil_loc_nat)}</td>
              </tr>
            </tbody>
          </table>
                    <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 11px;">
            <div style="text-align: left; width: 60%;  margin-top: 30px;">
                      </div>
            <div style="text-align: right; width: 35%;">
              ស្ទឹងត្រែង ${formatKhmerDate(new Date())}<br/>
              <strong style="font-size: 12px; margin-right: 30px;">អ្នកធ្វើរបាយការណ៍</strong>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 9px;">
            <div style="text-align: left; width: 100%;  margin-top: 100px;">
              <strong>កំណត់សម្គាល់</strong><br/>
              ១.រយះពេលរាយការណ៍ គឺថ្ងៃចន្ទ ដល់ថ្ងៃអាទិត្យនៃសប្តាហ៍នីមួយៗ<br/>
              ២.ការិយាល័យស្រុកប្រតិបត្តិបូកទិន្នន័យសម្រាលរបស់មណ្ឌលសុខភាពមន្ទីរពេទ្យបង្អែករបស់ខ្លួនផ្ញើទៅមន្ទីរសុខាភិបាលនៅរាល់ថ្ងៃចន្ទ<br/>
              ៣.មន្ទីរសុខាភិបាលរាជធានីខេត្ត ត្រូវបូកសរុបរបាយការណ៍សម្រាលរបស់ស្រុកប្រតិបត្តិនិងមន្ទីរពេទ្យខេត្តរួចផ្ញើមកនាយកដ្ឋានផែនការនៅរាល់ថ្ងៃអង្គារ៍<br/>
              ៤.មន្ទីរពេទ្យជាតិ និងមជ្ឈមណ្ឌលជាតិ ត្រូវផ្ញើរបាយការណ៍សម្រាលមកនាយកដ្ឋានផែនការនៅរាល់ថ្ងៃចន្ទ<br/>
              ៥.នាយកដ្ឋានផែនការ ត្រូវបូកសរុបរបាយការណ៍សម្រាលទូទាំងប្រទេសរួចផ្ញើជូនថ្នាក់ដឹកនាំ នៅរាល់ថ្ងៃព្រហស្បតិ៍<br/>
              ៦.របាយការណ៍ប្រចាំសប្តាហ៍ត្រូវធ្វើតាមអាស័យដ្ឋានតេឡេក្រាមក្រុម Delivery Weekly Report របស់នាយកដ្ឋានផែនការ<br/>
              ៧.តួលេខដែលត្រូវបំពេញ គឺជាចំនួនស្ត្រីជាម្តាយដែលបានសម្រាលកូន មិនមែនចំនួនទារក
            </div>
        
          </div>
        </body>
      </html>
    `;
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-khmer">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/it-view')} className="p-2 hover:bg-white rounded-full transition-all">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-blue-900 ml-4">របាយាការណ៍ស្ថិតិសម្រាលកូនប្រចាំសប្តាហ៍</h1>
                </div>
                <button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all font-bold">
                    <Plus size={20} /> បន្ថែមរបាយការណ៍ថ្មី
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border mb-6 flex flex-wrap gap-4 items-end">
                <div className="w-full sm:w-40">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ឆ្នាំ</label>
                    <select
                        value={filterYear}
                        onChange={(e) => { setPage(1); setFilterYear(e.target.value); }}
                        className="w-full border-2 p-2.5 rounded-xl bg-gray-50 outline-none focus:border-blue-500 transition-all font-bold"
                    >
                        {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div className="w-full sm:w-40">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">សប្តាហ៍ទី</label>
                    <input
                        type="number"
                        placeholder="លេខសប្តាហ៍"
                        value={filterWeek}
                        onChange={(e) => { setPage(1); setFilterWeek(e.target.value); }}
                        className="w-full border-2 p-2.5 rounded-xl bg-gray-50 outline-none focus:border-blue-500 transition-all font-bold"
                    />
                </div>
                <button
                    onClick={() => { setFilterYear(new Date().getFullYear().toString()); setFilterWeek(''); }}
                    className="px-4 py-2.5 text-gray-500 hover:text-blue-600 font-bold transition-all text-sm mb-0.5"
                >
                    Reset
                </button>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="p-4 font-bold text-sm text-center">ID</th>
                                <th className="p-4 font-bold text-sm text-center">សប្តាហ៍ទី</th>
                                <th className="p-4 font-bold text-sm text-center">ឆ្នាំ</th>
                                <th className="p-4 font-bold text-sm text-center">សរុបករណី</th>
                                <th className="p-4 font-bold text-sm text-center">ថ្ងៃបង្កើត</th>
                                <th className="p-4 font-bold text-sm text-center">បង្កើតដោយ</th>
                                <th className="p-4 font-bold text-sm text-center">សកម្មភាព</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr><td colSpan="7" className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></td></tr>
                            ) : reports.length === 0 ? (
                                <tr><td colSpan="7" className="p-10 text-center text-gray-400">មិនមានទិន្នន័យឡើយ</td></tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="p-4 text-center font-bold text-gray-400">#{report.id}</td>
                                        <td className="p-4 text-center font-bold">សប្តាហ៍ទី {report.week_number}</td>
                                        <td className="p-4 text-center">{report.year_number}</td>
                                        <td className="p-4 text-center">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">{report.total_case} ករណី</span>
                                        </td>
                                        <td className="p-4 text-center text-gray-500 text-sm">{new Date(report.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-center font-medium">{report.created_by}</td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEditClick(report)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all" title="Edit"><Pencil size={18} /></button>
                                                <button onClick={() => handlePrint(report)} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all" title="Print"><Printer size={18} /></button>
                                                <button onClick={() => handleDelete(report.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all" title="Delete"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Integration */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className={`p-5 flex justify-between items-center text-white ${modalMode === 'edit' ? 'bg-blue-900' : 'bg-green-700'}`}>
                            <h2 className="text-xl font-bold">{modalMode === 'edit' ? 'កែប្រែរបាយការណ៍' : 'បញ្ចូលរបាយការណ៍ថ្មី'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="hover:opacity-70 transition-opacity"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* General Info */}
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-dashed">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">សប្តាហ៍ទី</label>
                                    <input type="number" name="week_number" value={formData.week_number} onChange={handleInputChange} required className="w-full p-2 border rounded-lg font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">ឆ្នាំ</label>
                                    <input type="number" name="year_number" value={formData.year_number} onChange={handleInputChange} required className="w-full p-2 border rounded-lg font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">ចាប់ពីថ្ងៃ</label>
                                    <DatePicker name="start_date" value={formData.start_date ? formData.start_date.split('T')[0] : ''} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">ដល់ថ្ងៃ</label>
                                    <DatePicker name="end_date" value={formData.end_date ? formData.end_date.split('T')[0] : ''} onChange={handleInputChange} required />
                                </div>
                            </div>

                            {/* Data Sections */}
                            {['system', 'nonsystem', 'civil'].map(section => (
                                <div key={section} className="border-2 rounded-2xl p-4 bg-white shadow-sm overflow-hidden md:last:col-span-2">
                                    <h3 className="text-lg font-bold text-blue-900 border-b pb-2 mb-4 uppercase flex items-center gap-2">
                                        <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                                        {section === 'system' ? 'ក្នុងប្រព័ន្ធ' : section === 'nonsystem' ? 'ក្រៅប្រព័ន្ធ' : 'មន្ត្រីរាជការ'}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <p className="text-xs font-bold text-gray-400 border-b pb-1">ចំនួនកូន</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="text-[10px] block opacity-60">ទោល</label>
                                                    <input type="number" name={`${section}_single`} value={formData[`${section}_single`]} onChange={handleInputChange} className="w-full p-1.5 border rounded-lg text-center font-bold" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] block opacity-60">ភ្លោះ២</label>
                                                    <input type="number" name={`${section}_twins`} value={formData[`${section}_twins`]} onChange={handleInputChange} className="w-full p-1.5 border rounded-lg text-center font-bold text-blue-600" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] block opacity-60">ភ្លោះ៣</label>
                                                    <input type="number" name={`${section}_triplets`} value={formData[`${section}_triplets`]} onChange={handleInputChange} className="w-full p-1.5 border rounded-lg text-center font-bold text-purple-600" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-xs font-bold text-gray-400 border-b pb-1">សម្រាលនៅ</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-[10px] block opacity-60">ម.សុខភាព</label>
                                                    <input type="number" name={`${section}_loc_hc`} value={formData[`${section}_loc_hc`]} onChange={handleInputChange} className="w-full p-1.5 border rounded-lg text-center" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] block opacity-60">ម.ព ក្រុង/ស្រុក</label>
                                                    <input type="number" name={`${section}_loc_dist`} value={formData[`${section}_loc_dist`]} onChange={handleInputChange} className="w-full p-1.5 border rounded-lg text-center" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] block opacity-60">ម.ព ខេត្ត</label>
                                                    <input type="number" name={`${section}_loc_prov`} value={formData[`${section}_loc_prov`]} onChange={handleInputChange} className="w-full p-1.5 border rounded-lg text-center" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] block opacity-60">ម.ព ជាតិ</label>
                                                    <input type="number" name={`${section}_loc_nat`} value={formData[`${section}_loc_nat`]} onChange={handleInputChange} className="w-full p-1.5 border rounded-lg text-center" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">បោះបង់</button>
                                <button type="submit" disabled={submitting} className={`px-10 py-3 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${modalMode === 'edit' ? 'bg-blue-600' : 'bg-green-600'}`}>
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    រក្សារទុកទិន្នន័យ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Alerts */}
            {alertConfig.isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in zoom-in duration-200">
                        <div className="flex justify-center mb-4">
                            {alertConfig.type === 'success' ? <CheckCircle className="text-green-500" size={64} /> : alertConfig.type === 'warning' ? <AlertTriangle className="text-yellow-500" size={64} /> : <X className="text-red-500 border-4 border-red-500 rounded-full p-2" size={64} />}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{alertConfig.title}</h3>
                        <p className="text-gray-600 mb-6">{alertConfig.message}</p>
                        <div className="flex gap-2">
                            {alertConfig.onConfirm ? (
                                <>
                                    <button onClick={closeAlert} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all">បោះបង់</button>
                                    <button onClick={alertConfig.onConfirm} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">យល់ព្រម</button>
                                </>
                            ) : (
                                <button onClick={closeAlert} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">យល់ព្រម</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}