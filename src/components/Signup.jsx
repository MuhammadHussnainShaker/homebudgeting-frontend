import { useState } from 'react'
import useUserStore from '../store/useUserStore'

export default function Signup() {
  const [displayName, setDisplayName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const login = useUserStore((state) => state.login)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName,
          phoneNumber,
        }),
      })
      const data = await response.json()
      console.log(data)
      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Signup failed')
      }

      login(data.data.user)
    } catch (error) {
      console.error(
        'Following error occured while submitting signup form',
        error,
      )
      alert(error?.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='displayName'>Name: </label>
        <input
          type='text'
          name='displayName'
          id='displayName'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className='border-1'
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor='phoneNumber'>Phone Number: </label>
        <input
          type='text'
          name='phoneNumber'
          id='phoneNumber'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className='border-1'
          disabled={isSubmitting}
        />
      </div>
      <button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Signup'}
      </button>
    </form>
  )
}
