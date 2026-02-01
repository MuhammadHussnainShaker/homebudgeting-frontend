import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import useUserStore from '../store/useUserStore'
import Login from './Login'

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: { isAuthenticated: false, userData: null } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('submits login data and stores user on success', async () => {
    const user = { _id: 'u1', displayName: 'Ali', isActive: true }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true, data: { user } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '03001234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() =>
      expect(useUserStore.getState().user.userData).toEqual(user),
    )

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/users/login',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: '03001234567' }),
      }),
    )
  })

  it('renders API error message on failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        success: false,
        message: 'Invalid credentials',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '03001234567' },
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })
})
