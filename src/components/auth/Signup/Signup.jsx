import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useFirebaseUIWidget } from '@firebase-oss/ui-react'
import { EmailAuthProvider, sendEmailVerification } from 'firebase/auth'
import { auth } from '@/services/firebase/firebaseClient'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function Signup() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const uiConfig = {
    signInOptions: [
      {
        provider: EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true,
        signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: async (authResult) => {
        try {
          const user = authResult.user
          
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
        
        // Return false to prevent FirebaseUI from handling the redirect
        return false
      },
      signInFailure: (error) => {
        console.error('Signup failed:', error)
        setError(error?.message || 'Signup failed')
      },
    },
    credentialHelper: 'none',
    autoUpgradeAnonymousUsers: false,
  }

  const [containerRef] = useFirebaseUIWidget(auth, uiConfig)

  return (
    <div className='max-w-md mx-auto space-y-3'>
      <h1 className='text-2xl font-semibold text-center'>Sign Up</h1>
      <ErrorMessage message={error} />
      <div ref={containerRef} />
    </div>
  )
}
