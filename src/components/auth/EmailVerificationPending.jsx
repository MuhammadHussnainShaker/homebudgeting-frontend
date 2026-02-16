import { useState } from 'react'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '@/services/firebase/firebaseClient'

export default function EmailVerificationPending() {
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleResendVerification() {
    setIsSending(true)
    setMessage('')
    setError('')

    try {
      const user = auth.currentUser
      if (user) {
        await sendEmailVerification(user)
        setMessage('Verification email sent! Please check your inbox.')
      }
    } catch (error) {
      console.error('Error sending verification email:', error)
      setError(error?.message || 'Failed to send verification email')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className='max-w-md mx-auto space-y-4 text-center'>
      <h2 className='text-2xl font-semibold'>Verify Your Email</h2>
      <p className='text-slate-600'>
        We've sent a verification email to your address. Please check your
        inbox and click the verification link to continue.
      </p>

      {message && (
        <div className='bg-green-100 text-green-800 p-3 rounded text-sm'>
          {message}
        </div>
      )}

      {error && (
        <div className='bg-red-100 text-red-800 p-3 rounded text-sm'>
          {error}
        </div>
      )}

      <button
        className='w-full rounded border border-slate-700/50 px-3 py-2 text-sm'
        onClick={handleResendVerification}
        disabled={isSending}
      >
        {isSending ? 'Sending...' : 'Resend Verification Email'}
      </button>

      <p className='text-sm text-slate-500'>
        After verifying your email, please refresh this page or log in again.
      </p>
    </div>
  )
}
