'use client'

import { api_endpoint } from '@/lib/utils'
import { User } from '@/types/user'
import { useState, useEffect, useCallback } from 'react'

// Custom hook to check if the user is authenticated
export function useAuthClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // Function to fetch authentication status
  const checkAuthStatus = useCallback(async () => {
    setLoading(true)

    try {
      // Make an API request to check if the user is authenticated
      const response = await fetch(`${api_endpoint}/api/v1/user/auth/status`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      })

      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setUser(data.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to verify authentication:', error)
      setIsAuthenticated(false)
      setUser(null)
    }

    setLoading(false)
  }, [])

  // Call checkAuthStatus when the component mounts
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return { isAuthenticated, loading, user }
}
