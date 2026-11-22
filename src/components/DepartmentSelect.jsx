import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export const DEPARTMENTS = [
  'ផ្នែកសម្ភព និងរោគស្ត្រី',
  'ផ្នែករបួស និងវះកាត់',
  'ផ្នែកសង្គ្រោះបន្ទាន់',
  'ផ្នែកជំងឺទូទៅ',
  'ផ្នែកជំងឺកុមារ',
  'ផ្នែកជំងឺរបេង',
  'ផ្នែកចក្ខុរោគ',
  'ផ្នែកថែទាំទារក'
]

export default function DepartmentSelect({
  label,
  value,
  onChange,
  name = 'department',
  required = false,
  disabled = false,
  includeAll = false,
  className = ''
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const placeholder = includeAll ? '-- គ្រប់ផ្នែកទាំងអស់ --' : '-- ជ្រើសរើសផ្នែក --'
  const selectedLabel = value || placeholder

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const selectDepartment = (department) => {
    onChange({ target: { name, value: department } })
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="w-full">
      {label && <label htmlFor={name} className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</label>}
      <div className="relative">
        <button
          id={name}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen(current => !current)}
          className={`flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm shadow-sm outline-none transition-all hover:border-slate-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${className}`}
        >
          <span className={value ? 'text-slate-800' : 'text-slate-500'}>{selectedLabel}</span>
          <ChevronDown aria-hidden="true" size={17} className={`ml-3 shrink-0 text-slate-700 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div role="listbox" aria-label={label || 'Department'} className="absolute left-0 right-0 z-40 mt-2 max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
            <button type="button" role="option" aria-selected={!value} onClick={() => selectDepartment('')} className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100 ${!value ? 'bg-slate-100 font-medium text-slate-800' : 'text-slate-500'}`}>
              {placeholder}
            </button>
            {DEPARTMENTS.map(department => (
              <button key={department} type="button" role="option" aria-selected={value === department} onClick={() => selectDepartment(department)} className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100 ${value === department ? 'bg-slate-100 font-medium text-slate-800' : 'text-slate-700'}`}>
                {department}
              </button>
            ))}
          </div>
        )}
        {/* Keep the original option list out of the page while retaining native form semantics. */}
        <select
          name={name}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          value={value || ''}
          onChange={onChange}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        >
          <option value="">{placeholder}</option>
          {DEPARTMENTS.map(department => <option key={department} value={department}>{department}</option>)}
        </select>
      </div>
    </div>
  )
}
