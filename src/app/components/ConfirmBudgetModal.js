'use client'

import { createBudget } from '@/app/actions/budgets'
import { useState } from 'react'

export default function ConfirmBudgetModal({ isOpen, onClose, month, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

 async function handleConfirm() {
  setLoading(true)
  setError(null)

  const formData = new FormData()
  formData.set('month', month.value)

  const result = await createBudget(formData)

  if (result?.error) {
    setError(result.error)
    setLoading(false)
  } else {
    // Create the budget object to pass back
    const newBudget = {
      month: `${month.value}-01`,
      name: month.fullLabel
    }
    if (onSuccess) {
      onSuccess(newBudget)
    }
    // Still reload to ensure fresh data
    window.location.reload()
  }
}

  if (!isOpen || !month) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#00bf63]/10">
              <svg
                className="h-6 w-6 text-[#00bf63]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Start planning for {month.fullLabel}?
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              This will create a new budget for {month.fullLabel}. You'll be able to add pay periods and track expenses.
            </p>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 rounded-md bg-[#00bf63] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#33d98a] disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Start Planning'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}