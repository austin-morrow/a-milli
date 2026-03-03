'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SpendingTracker({ children }) {
  const pathname = usePathname()

  useEffect(() => {
    // Only track if we're in a spending page
    if (pathname.startsWith('/spending/')) {
      localStorage.setItem('lastSpendingTab', pathname)
    }
  }, [pathname])

  return <>{children}</>
}