import { useState } from 'react'
import useUserStore from '@/store/useUserStore'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { apiFetch } from '@/utils/apiFetch'

export default function Signup() {
  const [displayName, setDisplayName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const login = useUserStore((state) => state.login)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const data = await apiFetch('/api/v1/users/register', {
        method: 'POST',
        body: JSON.stringify({ displayName, phoneNumber }),
      })
      login(data.data.user)
    } catch (error) {
      console.error('Error occurred while submitting signup form', error)
      setError(error?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='max-w-md mx-auto space-y-3'>
      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className='space-y-3'>
        <div className='grid gap-1'>
          <label htmlFor='displayName' className='text-sm'>
            Name
          </label>
          <input
            className='rounded border border-slate-700/50 bg-transparent px-2 py-1 text-sm'
            type='text'
            name='displayName'
            id='displayName'
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

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
          {isSubmitting ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  )
}
