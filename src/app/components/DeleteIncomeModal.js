'use client'

import { deleteRecurringIncome, deleteMiscIncome } from '@/app/actions/income'
import { useState } from 'react'

export default function DeleteIncomeModal({ isOpen, onClose, item }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleDelete() {
    setLoading(true)
    setError(null)

    const result = item.type === 'recurring' 
      ? await deleteRecurringIncome(item.id)
      : await deleteMiscIncome(item.id)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setLoading(false)
      onClose()
    }
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Delete Income</h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete this {item.type === 'recurring' ? 'paycheck' : 'misc income'}? This action cannot be undone.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

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
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}