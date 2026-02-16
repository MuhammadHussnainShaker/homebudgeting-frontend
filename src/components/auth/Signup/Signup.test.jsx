import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import useUserStore from '@/store/useUserStore'
import Signup from '@/components/auth/Signup/Signup'

describe('Signup', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: { isAuthenticated: false, userData: null } })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('submits signup data and navigates to verify email on success', async () => {
    const mockUser = {
      uid: 'u2',
      displayName: 'Zara',
      email: 'zara@example.com',
      emailVerified: false,
    }

    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    })
    vi.mocked(updateProfile).mockResolvedValue()
    vi.mocked(sendEmailVerification).mockResolvedValue()

    render(
      <MemoryRouter>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/verify-email' element={<div>Verify Email Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Zara' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'zara@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /signup/i }))

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalled()
      expect(updateProfile).toHaveBeenCalled()
      expect(sendEmailVerification).toHaveBeenCalled()
    })

    // Should navigate to verify email page
    await waitFor(() => {
      expect(screen.getByText('Verify Email Page')).toBeInTheDocument()
    })
  }, 10000)

  it('renders error message on failure', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(
      new Error('Email already in use')
    )

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Zara' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'zara@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /signup/i }))

    expect(await screen.findByText(/Email already in use/i)).toBeInTheDocument()
  })
})
