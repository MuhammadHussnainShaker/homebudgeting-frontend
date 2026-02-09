import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useError from '@/hooks/useError'

function TestComponent({ timeoutMs = 1000 }) {
  const { error, setError, clearError } = useError(timeoutMs)

  return (
    <div>
      <span data-testid='error'>{error}</span>
      <button type='button' onClick={() => setError('Oops!')}>
        Set Error
      </button>
      <button type='button' onClick={clearError}>
        Clear Error
      </button>
    </div>
  )
}

describe('useError', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('auto-clears the error after the timeout', () => {
    vi.useFakeTimers()
    render(<TestComponent timeoutMs={1000} />)

    fireEvent.click(screen.getByRole('button', { name: /set error/i }))
    expect(screen.getByTestId('error')).toHaveTextContent('Oops!')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('error')).toHaveTextContent('')
  })

  it('clears the error early and cancels pending timeout', () => {
    vi.useFakeTimers()
    render(<TestComponent timeoutMs={1000} />)

    fireEvent.click(screen.getByRole('button', { name: /set error/i }))
    fireEvent.click(screen.getByRole('button', { name: /clear error/i }))

    expect(screen.getByTestId('error')).toHaveTextContent('')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('error')).toHaveTextContent('')
  })
})
