import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import useUserStore from '../store/useUserStore'

export default function Protected({ authenticationRequired = true }) {
  const isAuthenticated = useUserStore((state) => state.user.isAuthenticated)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (authenticationRequired && !isAuthenticated) {
      // navigate to login if not authenticated
      console.log('navigating to login')
      navigate('/login')
    } else if (!authenticationRequired && isAuthenticated) {
      // navigate to dashboard if authenticated
      navigate('/dashboard')
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, authenticationRequired, navigate])

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return <Outlet />
}


