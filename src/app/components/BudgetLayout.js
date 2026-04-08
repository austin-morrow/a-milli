'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, CalendarIcon, Squares2X2Icon } from '@heroicons/react/24/outline'
import { useRouter, usePathname } from 'next/navigation'
import ConfirmBudgetModal from '@/app/components/ConfirmBudgetModal'
import BudgetCalendarView from '@/app/components/BudgetCalendarView'

export default function BudgetLayout({ budgets, selectedBudget, setSelectedBudget, expenses }) {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [monthOffset, setMonthOffset] = useState(0)
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false)

  // Determine current view
  const isCalendarView = pathname.includes('/calendar')

  // Generate 6 months starting from monthOffset
  const generateMonths = () => {
    const months = [];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset + i,
        1,
      );

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const value = `${year}-${month}`;

      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const fullLabel = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      const existingBudget = budgets.find((b) => b.month === `${value}-01`);

      months.push({ value, label, fullLabel, existingBudget });
    }
    return months;
  };

  const months = generateMonths();

  const handleMonthClick = (month) => {
    if (month.existingBudget) {
      setSelectedBudget(month.existingBudget);
      setIsMonthSelectorOpen(false);
    } else {
      setSelectedMonth(month);
      setIsConfirmModalOpen(true);
    }
  };

  const scrollLeft = () => {
    setMonthOffset((prev) => prev - 6);
  };

  const scrollRight = () => {
    setMonthOffset((prev) => prev + 6);
  };

  const displayName =
    selectedBudget?.name ||
    new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const stats = [
  { name: 'Total Subscribers', stat: '71,897' },
  { name: 'Avg. Open Rate', stat: '58.16%' },
  { name: 'Avg. Click Rate', stat: '24.57%' },
]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {/* Header with Month/Year and View Toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsMonthSelectorOpen(!isMonthSelectorOpen)}
            className="flex items-center gap-2 group"
          >
            <h1 className="text-2xl font-bold text-gray-900">
              {displayName}
            </h1>
            <ChevronDownIcon
              className={`h-6 w-6 text-gray-400 transition-transform ${
                isMonthSelectorOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/spending/budget')}
              className={`p-2 rounded-lg transition-colors ${
                !isCalendarView 
                  ? 'bg-[#00bf63] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="List View"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.push('/spending/budget/calendar')}
              className={`p-2 rounded-lg transition-colors ${
                isCalendarView 
                  ? 'bg-[#00bf63] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Calendar View"
            >
              <CalendarIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Month Selector */}
        {isMonthSelectorOpen && (
          <div className="relative mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
              </button>

              <div className="flex gap-3 overflow-hidden">
                {months.map((month) => (
                  <button
                    key={month.value}
                    onClick={() => handleMonthClick(month)}
                    className={`flex-shrink-0 w-20 px-2 py-2 rounded-lg border-2 transition-all ${
                      selectedBudget?.month === `${month.value}-01`
                        ? "border-[#00bf63] bg-[#00bf63]/5 text-[#00bf63] font-semibold"
                        : month.existingBudget
                          ? "border-gray-200 bg-white hover:border-gray-300"
                          : "border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium">
                        {month.label.split(" ")[0]}
                      </div>
                      <div className="text-xs text-gray-600">
                        {month.label.split(" ")[1]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={scrollRight}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Budget Content */}
      {selectedBudget ? (
        isCalendarView ? (
          <BudgetCalendarView 
            selectedBudget={selectedBudget} 
            expenses={expenses}
          />
        ) : (
          <div className="bg-gray-50 rounded-lg p-6">
            
<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>

          </div>
        )
      ) : (
        <div className="text-center py-12">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="mx-auto size-12 text-gray-400"
          >
            <path
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No budget selected
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Click the month above to get started.
          </p>
        </div>
      )}

      <ConfirmBudgetModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        month={selectedMonth}
        onSuccess={(newBudget) => {
          setSelectedBudget(newBudget);
          setIsConfirmModalOpen(false);
        }}
      />
    </div>
  );
}