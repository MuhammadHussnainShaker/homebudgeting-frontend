import { useCallback, useEffect, useRef, useState } from 'react'

export default function useError(timeoutMs = 5000) {
  const [error, setErrorState] = useState('')
  const timeoutRef = useRef(null)

  const clearError = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setErrorState('')
  }, [])

  const setError = useCallback(
    (message) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      const nextMessage = message ?? ''
      setErrorState(nextMessage)

      if (nextMessage && timeoutMs > 0) {
        timeoutRef.current = setTimeout(() => {
          setErrorState('')
          timeoutRef.current = null
        }, timeoutMs)
      }
    },
    [timeoutMs],
  )

  useEffect(() => () => clearError(), [clearError])

  return { error, setError, clearError }
}
