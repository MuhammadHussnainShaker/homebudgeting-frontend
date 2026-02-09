import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import useUserStore from '../../../store/useUserStore'
import Signup from './Signup'

describe('Signup', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: { isAuthenticated: false, userData: null } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('submits signup data and stores user on success', async () => {
    const user = { _id: 'u2', displayName: 'Zara', isActive: true }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true, data: { user } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<Signup />)

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Zara' },
    })
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '03001234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: /signup/i }))

    await waitFor(() =>
      expect(useUserStore.getState().user.userData).toEqual(user),
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/users/register',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Zara',
          phoneNumber: '03001234567',
        }),
      }),
    )
  })

  it('renders API error message on failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        success: false,
        message: 'Signup failed',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<Signup />)

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Zara' },
    })
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '03001234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: /signup/i }))

    expect(await screen.findByText('Signup failed')).toBeInTheDocument()
  })
})
