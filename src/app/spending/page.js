'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SpendingPage() {
  const router = useRouter()

  useEffect(() => {
    // Get last visited spending tab from localStorage
    const lastTab = localStorage.getItem('lastSpendingTab') || '/spending/income'
    router.push(lastTab)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Loading...</p>
    </div>
  )
}