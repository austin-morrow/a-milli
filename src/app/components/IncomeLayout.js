'use client'

import { useState } from 'react'
import AddRecurringIncomeModal from '@/app/components/AddRecurringIncomeModal'
import EditRecurringIncomeModal from '@/app/components/EditRecurringIncomeModal'
import DeleteIncomeModal from '@/app/components/DeleteIncomeModal'
import AddMiscIncomeModal from '@/app/components/AddMiscIncomeModal'
import EditMiscIncomeModal from '@/app/components/EditMiscIncomeModal'

export default function IncomeLayout({ recurringIncome, miscIncome, accounts }) {
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false)
  const [isEditRecurringModalOpen, setIsEditRecurringModalOpen] = useState(false)
  const [selectedRecurring, setSelectedRecurring] = useState(null)
  
  const [isMiscModalOpen, setIsMiscModalOpen] = useState(false)
  const [isEditMiscModalOpen, setIsEditMiscModalOpen] = useState(false)
  const [selectedMisc, setSelectedMisc] = useState(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleEditRecurring = (income) => {
    setSelectedRecurring(income)
    setIsEditRecurringModalOpen(true)
  }

  const handleDeleteRecurring = (income) => {
    setDeleteItem({ ...income, type: 'recurring' })
    setIsDeleteModalOpen(true)
  }

  const handleEditMisc = (income) => {
    setSelectedMisc(income)
    setIsEditMiscModalOpen(true)
  }

  const handleDeleteMisc = (income) => {
    setDeleteItem({ ...income, type: 'misc' })
    setIsDeleteModalOpen(true)
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Income</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your paychecks and miscellaneous income
        </p>
      </div>

      {/* Two column grid */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
        {/* Left column - Recurring Income (Paychecks) */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Paychecks</h2>
            <button
              onClick={() => setIsRecurringModalOpen(true)}
              className="rounded-md bg-[#00bf63] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#33d98a]"
            >
              Add Paycheck
            </button>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              {recurringIncome.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No paychecks yet</p>
                  <button
                    onClick={() => setIsRecurringModalOpen(true)}
                    className="mt-4 text-sm font-medium text-[#00bf63] hover:text-[#33d98a]"
                  >
                    Add your first paycheck
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {recurringIncome.map((income) => (
                    <li key={income.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(income.amount)}
                            </p>
                            <span className="text-xs text-gray-500">
                              • {income.accounts?.nickname}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(income.date)}
                          </p>
                          {income.description && (
                            <p className="text-xs text-gray-400 mt-1">
                              {income.description}
                            </p>
                          )}
<div className="mt-2 flex gap-2 text-xs">
  {income.planned_amount && (
    <span className="text-gray-600">
      Planned: {formatCurrency(income.planned_amount)}
    </span>
  )}
  {income.received_amount && (
    <span className="text-green-600">
      Received: {formatCurrency(income.received_amount)}
    </span>
  )}
</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRecurring(income)}
                            className="text-sm font-medium text-[#00bf63] hover:text-[#33d98a]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRecurring(income)}
                            className="text-sm font-medium text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Misc Income */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Misc Income</h2>
            <button
              onClick={() => setIsMiscModalOpen(true)}
              className="rounded-md bg-[#00bf63] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#33d98a]"
            >
              Add
            </button>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              {miscIncome.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No misc income yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {miscIncome.map((income) => (
                    <li key={income.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(income.amount)}
                            </p>
                            <span className="text-xs text-gray-500">
                              • {income.accounts?.nickname}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(income.date)}
                          </p>
                          {income.description && (
                            <p className="text-xs text-gray-400 mt-1">
                              {income.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditMisc(income)}
                            className="text-sm font-medium text-[#00bf63] hover:text-[#33d98a]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMisc(income)}
                            className="text-sm font-medium text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddRecurringIncomeModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        accounts={accounts}
      />

      <EditRecurringIncomeModal
        isOpen={isEditRecurringModalOpen}
        onClose={() => {
          setIsEditRecurringModalOpen(false)
          setSelectedRecurring(null)
        }}
        income={selectedRecurring}
        accounts={accounts}
      />

      <AddMiscIncomeModal
        isOpen={isMiscModalOpen}
        onClose={() => setIsMiscModalOpen(false)}
        accounts={accounts}
      />

      <EditMiscIncomeModal
        isOpen={isEditMiscModalOpen}
        onClose={() => {
          setIsEditMiscModalOpen(false)
          setSelectedMisc(null)
        }}
        income={selectedMisc}
        accounts={accounts}
      />

      <DeleteIncomeModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeleteItem(null)
        }}
        item={deleteItem}
      />
    </>
  )
}