import { useState } from 'react'
import useUserStore from '../store/useUserStore'

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const login = useUserStore((state) => state.login)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Login failed')
      }

      login(data.data.user)
    } catch (error) {
      console.error('Following error occured while submitting login form', error)
      setError(error?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='max-w-md mx-auto space-y-3'>
      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <form onSubmit={handleSubmit} className='space-y-3'>
        <div className='grid gap-1'>
          <label htmlFor='phoneNumber' className='text-sm'>
            Phone Number
          </label>
          <input
            className='rounded border border-slate-700/50 bg-transparent px-2 py-1 text-sm'
            type='text'
            name='phoneNumber'
            id='phoneNumber'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          className='w-full rounded border border-slate-700/50 px-3 py-2 text-sm'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging up...' : 'Login'}
        </button>
      </form>
    </div>
  )
}