"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Hook that triggers project refresh on navigation changes
 */
export function useNavigationRefresh() {
  const pathname = usePathname()

  useEffect(() => {
    // Dispatch custom event to trigger project refresh
    const event = new CustomEvent('project-route-change', {
      detail: { pathname }
    })
    window.dispatchEvent(event)
  }, [pathname])
}

/**
 * Utility function to manually trigger project refresh
 */
export function triggerProjectRefresh() {
  const event = new CustomEvent('project-route-change', {
    detail: { manual: true }
  })
  window.dispatchEvent(event)
}