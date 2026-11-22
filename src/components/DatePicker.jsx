import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DatePicker({
  label,
  value,
  onChange,
  name = 'report_date',
  required = false,
  disabled = false,
  className = ''
}) {
  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = value ? new Date(`${value}T00:00:00`) : new Date()
    return new Date(initial.getFullYear(), initial.getMonth(), 1)
  })
  const containerRef = useRef(null)
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null
  const monthLabel = visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstWeekday = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay()
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate()
  const previousMonthDays = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 0).getDate()
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - firstWeekday + 1
    if (dayNumber < 1) return { day: previousMonthDays + dayNumber, outside: true, offset: -1 }
    if (dayNumber > daysInMonth) return { day: dayNumber - daysInMonth, outside: true, offset: 1 }
    return { day: dayNumber, outside: false, offset: 0 }
  })

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const formatValue = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const chooseDate = (day, offset) => {
    const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, day)
    onChange({ target: { name, value: formatValue(date.getFullYear(), date.getMonth(), date.getDate()) } })
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="w-full">
      {label && <label htmlFor={name} className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</label>}
      <div className="relative">
        <input
          type="date"
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
        <button
          id={name}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen(current => !current)}
          className={`flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm shadow-sm outline-none transition-all hover:border-slate-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${className}`}
        >
          <span className={value ? 'text-slate-800' : 'text-slate-500'}>{value || 'Select date'}</span>
          <span className="text-slate-400">▦</span>
        </button>
        {open && (
          <div role="dialog" aria-label="Choose date" className="absolute left-0 z-40 mt-2 w-[286px] rounded-lg border border-teal-400 bg-white p-3 shadow-xl">
            <div className="flex items-center justify-between px-1 pb-3">
              <button type="button" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))} className="rounded-full p-1 text-slate-300 hover:bg-slate-100 hover:text-slate-600"><ChevronLeft size={18} /></button>
              <strong className="text-sm font-bold text-slate-800">{monthLabel}</strong>
              <button type="button" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))} className="rounded-full p-1 text-slate-300 hover:bg-slate-100 hover:text-slate-600"><ChevronRight size={18} /></button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-700">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((weekday, index) => <span key={`${weekday}-${index}`} className="py-1">{weekday}</span>)}
              {calendarDays.map(({ day, outside, offset }, index) => {
                const isSelected = selectedDate && !outside && selectedDate.getFullYear() === visibleMonth.getFullYear() && selectedDate.getMonth() === visibleMonth.getMonth() && selectedDate.getDate() === day
                return <button key={`${day}-${index}`} type="button" onClick={() => chooseDate(day, offset)} className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors ${outside ? 'text-slate-300' : 'text-slate-700 hover:bg-teal-50'} ${isSelected ? 'bg-teal-100 text-slate-800 ring-1 ring-teal-200' : ''}`}>{day}</button>
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
