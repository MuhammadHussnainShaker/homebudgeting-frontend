import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/services/firebase/firebaseClient'
import useUserStore from '@/store/useUserStore'
import Login from '@/components/auth/Login/Login'

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: { isAuthenticated: false, userData: null } })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('submits login data for verified user', async () => {
    const mockUser = {
      uid: 'u1',
      displayName: 'Ali',
      email: 'ali@example.com',
      emailVerified: true,
    }

    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'ali@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'ali@example.com',
        'password123'
      )
    })
  }, 10000)

  it('renders error message for unverified email', async () => {
    const mockUser = {
      uid: 'u1',
      displayName: 'Ali',
      email: 'ali@example.com',
      emailVerified: false,
    }

    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    })

    auth.signOut = vi.fn().mockResolvedValue()

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'ali@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText(/Please verify your email/i)).toBeInTheDocument()
  })

  it('renders error message on failure', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
      new Error('Invalid credentials')
    )

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'ali@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument()
  })
})
