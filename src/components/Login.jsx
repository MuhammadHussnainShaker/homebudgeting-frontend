import { useState } from 'react'
import useUserStore from '../store/useUserStore'

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const login = useUserStore((state) => state.login)


  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    
    try {
      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      })
      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Login failed')
      }

      login(data.data.user)
    } catch (error) {
      console.error(
        'Following error occured while submitting login form',
        error,
      )
      setError(error?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
    {error && <p>{error}</p>}
    <form onSubmit={handleSubmit}>
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
        {isSubmitting ? 'Logging up...' : 'Login'}
      </button>
    </form>
    </>
  )
}