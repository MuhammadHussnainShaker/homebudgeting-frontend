import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/services/firebase/firebaseClient'
import useUserStore from '@/store/useUserStore'

export default function Protected({ authenticationRequired = true }) {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const login = useUserStore((state) => state.login)
  const logout = useUserStore((state) => state.logout)

  useEffect(() => {
    let isMounted = true
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isMounted) return
      
      if (user && user.emailVerified) {
        // User is signed in and email is verified
        login({
          _id: user.uid,
          displayName: user.displayName,
          email: user.email,
          isActive: true,
        })
        
        if (!authenticationRequired) {
          // User is authenticated but on a public route, redirect to dashboard
          navigate('/dashboard')
        } else {
          setIsLoading(false)
        }
      } else if (user && !user.emailVerified) {
        // User is signed in but email is not verified
        logout()
        navigate('/verify-email')
      } else {
        // User is signed out
        logout()
        
        if (authenticationRequired) {
          // User is not authenticated but on a protected route, redirect to login
          navigate('/login')
        } else {
          setIsLoading(false)
        }
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [authenticationRequired, navigate, login, logout])

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return <Outlet />
}

