import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Home,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  LayoutList,
  Search,
  User,
  ShieldCheck
} from 'lucide-react'

export default function Navbar({ user, onLogout }) {
  const [reportDropdown, setReportDropdown] = useState(false)
  const [activeSubMenu, setActiveSubMenu] = useState(null) // 'it' or 'discipline'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => {
    setMobileMenuOpen(false)
    setReportDropdown(false)
    setActiveSubMenu(null)
  }

  return (
    <nav className="sticky top-0 z-50 bg-blue-800 shadow-xl">
      <div className="w-full px-5 py-3 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold">សទ</div>
          <span className="text-white font-semibold text-sm">មន្ទីរពេទ្យខេត្តស្ទឹងត្រែង</span>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <LayoutList />
        </button>

        {/* Menu Container */}
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-full left-0 w-full md:w-auto bg-blue-800 md:bg-transparent flex-col md:flex-row p-4 md:p-0 gap-4 items-center`}>

          <ul className="flex flex-col md:flex-row list-none gap-2 m-0 p-0 w-full">
            <li>
              <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-2 text-white no-underline px-3 py-2 hover:bg-white/10 rounded-md text-sm">
                <Home size={18} /> ទំព័រដើម
              </Link>
            </li>

            {/* --- MAIN DROPDOWN --- */}
            <li className="relative group">
              <button
                onClick={() => setReportDropdown(!reportDropdown)}
                className="flex items-center justify-between gap-2 w-full text-white bg-transparent border-0 px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer text-sm"
              >
                <div className="flex items-center gap-2"><FileText size={18} /> របាយការណ៍</div>
                <ChevronDown size={14} className={reportDropdown ? 'rotate-180' : ''} />
              </button>

              {reportDropdown && (
                <div className="static md:absolute top-full left-0 mt-1 w-full md:w-56 bg-white rounded-md shadow-2xl py-2 z-[100]">

                  {/* Category 1: IT System */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveSubMenu(activeSubMenu === 'it' ? null : 'it')}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-blue-50 border-0 bg-transparent cursor-pointer text-sm font-medium"
                    >
                      <span className="flex items-center gap-2 text-blue-700">ផ្នែកប្រព័ន្ធពត៍មាន</span>
                      <ChevronRight size={14} className={activeSubMenu === 'it' ? 'rotate-90' : ''} />
                    </button>

                    {activeSubMenu === 'it' && (
                      <div className="bg-gray-100 md:absolute md:left-full md:top-0 md:w-56 md:bg-white md:shadow-xl border-l-4 border-blue-600">
                        <Link to="/it-add" onClick={closeMenu} className="flex items-center gap-2 px-6 py-2.5 text-gray-700 hover:text-blue-700 no-underline text-sm">
                          <PlusCircle size={16} /> បន្ថែមរបាយាការណ៍
                        </Link>
                        <Link to="/it-view" onClick={closeMenu} className="flex items-center gap-2 px-6 py-2.5 text-gray-700 hover:text-blue-700 no-underline text-sm">
                          <LayoutList size={16} /> មើលរបាយការណ៍ពេលរសៀល
                        </Link>
                        <Link to="/it-maternityreport" onClick={closeMenu} className="flex items-center gap-2 px-6 py-2.5 text-gray-700 hover:text-blue-700 no-underline text-sm">
                          <LayoutList size={16} /> របាយការណ៍សម្រាលកូន
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Category: Documents */}
                  <div className="relative border-t border-gray-100">
                    <button
                      onClick={() => setActiveSubMenu(activeSubMenu === 'documents' ? null : 'documents')}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-green-50 border-0 bg-transparent cursor-pointer text-sm font-medium"
                    >
                      <span className="flex items-center gap-2 text-green-700">ឯកសារ</span>
                      <ChevronRight size={14} className={activeSubMenu === 'documents' ? 'rotate-90' : ''} />
                    </button>

                    {activeSubMenu === 'documents' && (
                      <div className="bg-gray-100 md:absolute md:left-full md:top-0 md:w-56 md:bg-white md:shadow-xl border-l-4 border-green-600">
                        <Link to="/documents" onClick={closeMenu} className="flex items-center gap-2 px-6 py-2.5 text-gray-700 hover:text-green-700 no-underline text-sm">
                          <FileText size={16} /> គ្រប់គ្រងឯកសារ
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Category 2: Discipline */}
                  <div className="relative border-t border-gray-100">
                    <button
                      onClick={() => setActiveSubMenu(activeSubMenu === 'discipline' ? null : 'discipline')}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-red-50 border-0 bg-transparent cursor-pointer text-sm font-medium"
                    >
                      <span className="flex items-center gap-2 text-red-700">គណះកម្មវិន័យ</span>
                      <ChevronRight size={14} className={activeSubMenu === 'discipline' ? 'rotate-90' : ''} />
                    </button>

                    {activeSubMenu === 'discipline' && (
                      <div className="bg-gray-100 md:absolute md:left-full md:top-0 md:w-56 md:bg-white md:shadow-xl border-l-4 border-red-600">
                        <Link to="/dis-add" onClick={closeMenu} className="flex items-center gap-2 px-6 py-2.5 text-gray-700 hover:text-red-700 no-underline text-sm">
                          <Search size={16} /> បន្ថែមការអង្កេត
                        </Link>
                        <Link to="/dis-view" onClick={closeMenu} className="flex items-center gap-2 px-6 py-2.5 text-gray-700 hover:text-red-700 no-underline text-sm">
                          <FileText size={16} /> មើលរបាយការណ៍
                        </Link>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </li>

            <li>
              <Link to="/setting" onClick={closeMenu} className="flex items-center gap-2 text-white no-underline px-3 py-2 hover:bg-white/10 rounded-md text-sm">
                <Settings size={18} /> ការកំណត់
              </Link>
            </li>
          </ul>

          {/* User & Logout */}
          <div className="flex items-center gap-4 border-t md:border-0 border-white/20 pt-4 md:pt-0 w-full md:w-auto">
            <span className="text-white text-sm flex items-center gap-2"><User size={16} /> {user?.username}</span>
            <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white border-0 px-4 py-1.5 rounded text-xs cursor-pointer flex items-center gap-1">
              <LogOut size={14} /> ចាកចេញ
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}