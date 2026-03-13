'use client'

import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import AddPayPeriodModal from '@/app/components/AddPayPeriodModal'
import EditPayPeriodModal from '@/app/components/EditPayPeriodModal'
import DeletePayPeriodModal from '@/app/components/DeletePayPeriodModal'

export default function PayPeriodsList({ budgetId, payPeriods }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState(null)

const formatDate = (dateString) => {
  // Parse in local timezone to avoid UTC shift
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

  const handleEdit = (period) => {
    setSelectedPeriod(period)
    setIsEditModalOpen(true)
  }

  const handleDelete = (period) => {
    setSelectedPeriod(period)
    setIsDeleteModalOpen(true)
  }

  // Sort pay periods by start date
  const sortedPeriods = [...payPeriods].sort((a, b) => 
    new Date(a.start_date) - new Date(b.start_date)
  )

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Budget Periods</h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#00bf63] hover:text-[#33d98a]"
          >
            <PlusIcon className="h-4 w-4" />
            Add
          </button>
        </div>

        {/* Pay Periods List */}
        <div className="divide-y divide-gray-200">
          {sortedPeriods.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500 mb-3">No pay dates yet</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-[#00bf63] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#33d98a]"
              >
                <PlusIcon className="h-4 w-4" />
                Add Pay Date
              </button>
            </div>
          ) : (
            sortedPeriods.map((period) => (
              <div key={period.id} className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {period.description && (
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {period.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(period.start_date)} - {formatDate(period.end_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => handleEdit(period)}
                      className="text-xs text-gray-400 hover:text-[#00bf63]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(period)}
                      className="text-xs text-gray-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddPayPeriodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        budgetId={budgetId}
      />

      <EditPayPeriodModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPeriod(null)
        }}
        period={selectedPeriod}
      />

      <DeletePayPeriodModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedPeriod(null)
        }}
        period={selectedPeriod}
      />
    </>
  )
}