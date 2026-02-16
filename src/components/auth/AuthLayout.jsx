import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import useUserStore from '@/store/useUserStore'

export default function Protected({ authenticationRequired = true }) {
  const firebaseUser = useUserStore((state) => state.firebaseUser)
  const loading = useUserStore((state) => state.loading)
  const isAuthenticated = useUserStore((state) => state.user.isAuthenticated)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Wait for Firebase auth to initialize
    if (loading) {
      return
    }

    if (authenticationRequired) {
      // For protected routes, check Firebase auth and email verification
      if (!firebaseUser) {
        // Not signed in with Firebase - redirect to login
        navigate('/login')
      } else if (!firebaseUser.emailVerified) {
        // Firebase user exists but email not verified - redirect to verify page
        navigate('/verify-email')
      } else if (!isAuthenticated) {
        // Email verified but no backend user - redirect to login to trigger bootstrap
        navigate('/login')
      } else {
        // All checks passed - allow access
        setIsLoading(false)
      }
    } else {
      // For public auth routes (login/signup/verify-email)
      if (firebaseUser && firebaseUser.emailVerified && isAuthenticated) {
        // Fully authenticated user trying to access public auth pages - redirect to dashboard
        navigate('/dashboard')
      } else {
        // Allow access to public auth pages
        setIsLoading(false)
      }
    }
  }, [firebaseUser, loading, isAuthenticated, authenticationRequired, navigate])

  if (loading || isLoading) {
    return <h1>Loading...</h1>
  }

  return <Outlet />
}

