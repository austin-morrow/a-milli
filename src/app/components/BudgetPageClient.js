'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import BudgetLayout from '@/app/components/BudgetLayout'
import PayPeriodsList from '@/app/components/PayPeriodsList'

export default function BudgetPageClient({ budgets, expenses }) {
  // Get current month budget as fallback
  const currentDate = new Date()
  
  const currentMonth = budgets.find(b => {
    // Parse date in local timezone to avoid UTC shift
    const [year, month] = b.month.split('-').map(Number)
    const budgetDate = new Date(year, month - 1, 1)
    
    return budgetDate.getMonth() === currentDate.getMonth() && 
           budgetDate.getFullYear() === currentDate.getFullYear()
  })
  
  const [selectedBudget, setSelectedBudget] = useState(currentMonth || budgets[0])
  const [isInitialized, setIsInitialized] = useState(false)

  useLayoutEffect(() => {
    const savedBudgetId = localStorage.getItem('selectedBudgetId')
    if (savedBudgetId) {
      const savedBudget = budgets.find(b => b.id === savedBudgetId)
      if (savedBudget) {
        setSelectedBudget(savedBudget)
      }
    }
    setIsInitialized(true)
  }, [budgets])

  useEffect(() => {
    if (isInitialized && selectedBudget?.id) {
      const updatedBudget = budgets.find(b => b.id === selectedBudget.id)
      if (updatedBudget) {
        setSelectedBudget(updatedBudget)
      }
    }
  }, [budgets, selectedBudget?.id, isInitialized])

  useEffect(() => {
    if (isInitialized && selectedBudget?.id) {
      localStorage.setItem('selectedBudgetId', selectedBudget.id)
    }
  }, [selectedBudget, isInitialized])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <BudgetLayout 
          budgets={budgets} 
          selectedBudget={selectedBudget}
          setSelectedBudget={setSelectedBudget}
          expenses={expenses}
        />
      </div>

      <div className="lg:col-span-1">
        {selectedBudget ? (
          <PayPeriodsList
            key={selectedBudget.id}
            budgetId={selectedBudget.id}
            payPeriods={selectedBudget.budget_pay_periods || []}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Pay Dates
            </h3>
            <p className="text-xs text-gray-500">
              Select a budget to add pay dates
            </p>
          </div>
        )}
      </div>
    </div>
  )
}