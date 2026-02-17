import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import useUserStore from '@/store/useUserStore'

export default function Protected({ authenticationRequired = true }) {
  const isAuthenticated = useUserStore((s) => s.user.isAuthenticated)
  const firebaseUser = useUserStore((s) => s.firebaseUser)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (authenticationRequired) {
      // No Firebase user at all -> redirect to login
      if (!firebaseUser) {
        navigate('/login')
        return
      }
      
      // Firebase user exists but email not verified -> redirect to verify-email
      if (!firebaseUser.emailVerified) {
        navigate('/verify-email')
        return
      }
      
      // Firebase user verified but not authenticated in backend -> redirect to login
      if (!isAuthenticated) {
        navigate('/login')
        return
      }
    } else if (!authenticationRequired && isAuthenticated) {
      // Authenticated users shouldn't access public auth routes
      navigate('/dashboard')
      return
    }
    
    setIsLoading(false)
  }, [isAuthenticated, firebaseUser, authenticationRequired, navigate])

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return <Outlet />
}