'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import BudgetLayout from '@/app/components/BudgetLayout'
import PayPeriodsList from '@/app/components/PayPeriodsList'

export default function BudgetPageClient({ budgets }) {
  // Get current month budget as fallback
  const currentDate = new Date()
  console.log('Current date:', currentDate, 'Month:', currentDate.getMonth())
  
  const currentMonth = budgets.find(b => {
    // Parse date in local timezone to avoid UTC shift
    const [year, month] = b.month.split('-').map(Number)
    const budgetDate = new Date(year, month - 1, 1) // month - 1 because JS months are 0-indexed
    
    console.log(`Checking ${b.name}: budgetDate=${budgetDate}, month=${budgetDate.getMonth()}`)
    
    const matches = budgetDate.getMonth() === currentDate.getMonth() && 
           budgetDate.getFullYear() === currentDate.getFullYear()
    
    console.log(`  Matches current month? ${matches}`)
    
    return matches
  })
  
  console.log('Selected currentMonth budget:', currentMonth?.name)
  
  // Always start with current month or first budget (server-safe)
  const [selectedBudget, setSelectedBudget] = useState(currentMonth || budgets[0])
  console.log('Initial selectedBudget:', selectedBudget?.name)
  
  const [isInitialized, setIsInitialized] = useState(false)

  // Save to localStorage whenever budget changes
useEffect(() => {
  if (isInitialized && selectedBudget?.id) {
    console.log('Saving to localStorage:', selectedBudget.id, selectedBudget.name)
    localStorage.setItem('selectedBudgetId', selectedBudget.id)
  }
}, [selectedBudget, isInitialized])

  // Load from localStorage BEFORE paint (useLayoutEffect runs before browser paint)
  useLayoutEffect(() => {
    console.log('useLayoutEffect: Loading from localStorage')
    const savedBudgetId = localStorage.getItem('selectedBudgetId')
    console.log('Saved budget ID:', savedBudgetId)
    
    if (savedBudgetId) {
      const savedBudget = budgets.find(b => b.id === savedBudgetId)
      console.log('Found saved budget:', savedBudget?.name)
      if (savedBudget) {
        setSelectedBudget(savedBudget)
      }
    }
    setIsInitialized(true)
  }, [budgets])
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left: Budget Layout - takes 3 columns */}
      <div className="lg:col-span-3">
        <BudgetLayout 
          budgets={budgets} 
          selectedBudget={selectedBudget}
          setSelectedBudget={setSelectedBudget}
        />
      </div>

      {/* Right: Pay Periods - takes 1 column */}
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