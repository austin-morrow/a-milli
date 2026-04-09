'use client'

import { useState } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from '@heroicons/react/20/solid'

export default function BudgetCalendarView({ selectedBudget, expenses = [] }) {
  if (!selectedBudget) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-500">Select a budget to view calendar</p>
      </div>
    )
  }

  // Parse the budget month
  const [year, month] = selectedBudget.month.split('-').map(Number)
  const budgetDate = new Date(year, month - 1, 1)

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    
    // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay()
    // Convert to Monday = 0, Sunday = 6
 
    
    // Days from previous month
    const prevMonthDays = firstDayOfWeek
    const prevMonth = new Date(year, month - 2, 1)
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate()
    
    // Days from next month (to fill the grid)
    const totalDays = prevMonthDays + daysInMonth
    const nextMonthDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7)
    
    const days = []
    
    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day)
      days.push({
        date: date.toISOString().split('T')[0],
        isCurrentMonth: false,
        events: [],
      })
    }
    
  // Current month days
const today = new Date()
today.setHours(0, 0, 0, 0)

for (let day = 1; day <= daysInMonth; day++) {
  const date = new Date(year, month - 1, day)
  const dateStr = date.toISOString().split('T')[0]
  const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  // Find expenses for this day
  const dayExpenses = expenses.filter(exp => {
    // Monthly recurring: Match by day_of_month
    if (exp.recurrence_type === 'monthly' && exp.day_of_month === day) {
      return true
    }
    
    // Weekly recurring: Match by day of week
    if (exp.recurrence_type === 'weekly' && exp.weekly_days) {
      // weekly_days is a JSON array like [0, 3] for Sunday and Wednesday
      const weeklyDays = typeof exp.weekly_days === 'string' 
        ? JSON.parse(exp.weekly_days) 
        : exp.weekly_days
      return weeklyDays.includes(dayOfWeek)
    }
    
    // Yearly recurring: Match by exact date
    if (exp.recurrence_type === 'yearly' && exp.yearly_date) {
      const yearlyDate = new Date(exp.yearly_date)
      return yearlyDate.getMonth() === month - 1 && yearlyDate.getDate() === day
    }
    
    // Also match by exact date if expense has a specific date
    if (exp.date === dateStr) {
      return true
    }
    
    return false
  })
  
  days.push({
    date: dateStr,
    isCurrentMonth: true,
    isToday: date.getTime() === today.getTime(),
events: dayExpenses.map((exp, index) => ({
  id: `${exp.id}-${dateStr}`, // Make unique by combining expense ID with date
  expenseId: exp.id, // Keep original ID for reference
  name: exp.description || 'Expense',
  amount: exp.amount,
  category: exp.categories?.name,
  color: exp.categories?.color,
  recurrence: exp.recurrence_type,
})),
  })
}
    
    // Next month days
    const nextMonth = new Date(year, month, 1)
    for (let day = 1; day <= nextMonthDays; day++) {
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day)
      days.push({
        date: date.toISOString().split('T')[0],
        isCurrentMonth: false,
        events: [],
      })
    }
    
    return days
  }

  const days = generateCalendarDays()
  
  // Get events for mobile view (current month only)
  const currentMonthEvents = days
    .filter(day => day.isCurrentMonth && day.events.length > 0)
    .flatMap(day => day.events)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="lg:flex lg:h-full lg:flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <h1 className="text-base font-semibold text-gray-900">
          </h1>
        </header>

        <div className="shadow ring-1 ring-black/5 lg:flex lg:flex-auto lg:flex-col">
          <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs/6 font-semibold text-gray-700 lg:flex-none">
               <div className="flex justify-center bg-white py-2">
              <span>S</span>
              <span className="sr-only sm:not-sr-only">un</span>
            </div>
            <div className="flex justify-center bg-white py-2">
              <span>M</span>
              <span className="sr-only sm:not-sr-only">on</span>
            </div>
            <div className="flex justify-center bg-white py-2">
              <span>T</span>
              <span className="sr-only sm:not-sr-only">ue</span>
            </div>
            <div className="flex justify-center bg-white py-2">
              <span>W</span>
              <span className="sr-only sm:not-sr-only">ed</span>
            </div>
            <div className="flex justify-center bg-white py-2">
              <span>T</span>
              <span className="sr-only sm:not-sr-only">hu</span>
            </div>
            <div className="flex justify-center bg-white py-2">
              <span>F</span>
              <span className="sr-only sm:not-sr-only">ri</span>
            </div>
            <div className="flex justify-center bg-white py-2">
              <span>S</span>
              <span className="sr-only sm:not-sr-only">at</span>
            </div>
         
          </div>

          <div className="flex bg-gray-200 text-xs/6 text-gray-700 lg:flex-auto">
            {/* Desktop calendar */}
            <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
              {days.map((day) => (
                <div
                  key={day.date}
                  data-is-today={day.isToday ? '' : undefined}
                  data-is-current-month={day.isCurrentMonth ? '' : undefined}
                  className="group relative bg-gray-50 px-3 py-2 text-gray-500 data-[is-current-month]:bg-white min-h-[100px]"
                >
                  <time
                    dateTime={day.date}
                    className="relative group-[:not([data-is-current-month])]:opacity-75 [[data-is-today]_&]:flex [[data-is-today]_&]:size-6 [[data-is-today]_&]:items-center [[data-is-today]_&]:justify-center [[data-is-today]_&]:rounded-full [[data-is-today]_&]:bg-[#00bf63] [[data-is-today]_&]:font-semibold [[data-is-today]_&]:text-white"
                  >
                    {day.date.split('-').pop().replace(/^0/, '')}
                  </time>
                  {day.events.length > 0 ? (
                    <ol className="mt-2 space-y-1">
                      {day.events.slice(0, 2).map((event) => (
                        <li key={event.id}>
                          <div className="group flex flex-col">
                            <p className="flex-auto truncate text-xs font-medium text-gray-900">
                              {event.name}
                            </p>
                            <p className="text-xs text-[#00bf63] font-semibold">
                              {formatCurrency(event.amount)}
                            </p>
                          </div>
                        </li>
                      ))}
                      {day.events.length > 2 ? (
                        <li className="text-xs text-gray-500">+ {day.events.length - 2} more</li>
                      ) : null}
                    </ol>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Mobile calendar */}
            <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
              {days.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  data-is-today={day.isToday ? '' : undefined}
                  data-is-current-month={day.isCurrentMonth ? '' : undefined}
                  className="group relative flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10 data-[is-current-month]:bg-white data-[is-today]:font-semibold [&:not([data-is-current-month])]:bg-gray-50 [&:not([data-is-current-month])]:text-gray-500 data-[is-current-month]:text-gray-900 data-[is-today]:text-[#00bf63]"
                >
                  <time
                    dateTime={day.date}
                    className="ml-auto group-[:not([data-is-current-month])]:opacity-75"
                  >
                    {day.date.split('-').pop().replace(/^0/, '')}
                  </time>
                  <span className="sr-only">{day.events.length} events</span>
                  {day.events.length > 0 ? (
                    <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                      {day.events.map((event) => (
                        <span key={event.id} className="mx-0.5 mb-1 size-1.5 rounded-full bg-[#00bf63]" />
                      ))}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile event list */}
        {currentMonthEvents.length > 0 && (
          <div className="px-4 py-10 sm:px-6 lg:hidden">
            <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow outline outline-1 outline-black/5">
              {currentMonthEvents.map((event) => (
                <li key={event.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                  <div className="flex-auto">
                    <p className="font-semibold text-gray-900">{event.name}</p>
                    <p className="mt-2 text-[#00bf63] font-semibold">
                      {formatCurrency(event.amount)}
                    </p>
                    {event.category && (
                      <p className="mt-1 text-xs text-gray-500">{event.category}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}