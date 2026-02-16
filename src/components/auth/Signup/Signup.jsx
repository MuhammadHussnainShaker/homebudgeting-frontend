import { useState } from 'react'
import { useNavigate } from 'react-router'
import { SignUpAuthScreen } from '@firebase-oss/ui-react'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '@/services/firebase/firebaseClient'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function Signup() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignUp = async (credential) => {
    try {
      const user = credential.user
      
      // Determine the verification URL based on environment
      const verificationUrl = import.meta.env.DEV
        ? 'http://localhost:5173/login'
        : `${window.location.origin}/login`

      // Send email verification
      await sendEmailVerification(user, {
        url: verificationUrl,
      })

      // Sign out the user immediately after signup
      await auth.signOut()

      // Navigate to verify-email page
      navigate('/verify-email')
    } catch (err) {
      console.error('Error during signup:', err)
      setError(err?.message || 'Failed to send verification email')
    }
  }

  return (
    <div className='max-w-md mx-auto space-y-3'>
      <h1 className='text-2xl font-semibold text-center'>Sign Up</h1>
      <ErrorMessage message={error} />
      <SignUpAuthScreen onSignUp={handleSignUp} />
    </div>
  )
}
