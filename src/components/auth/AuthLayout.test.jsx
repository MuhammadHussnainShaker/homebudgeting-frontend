import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { onAuthStateChanged } from 'firebase/auth'
import useUserStore from '@/store/useUserStore'
import AuthLayout from '@/components/auth/AuthLayout'

describe('AuthLayout', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: { isAuthenticated: false, userData: null } })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('redirects unauthenticated users to login', async () => {
    // Mock onAuthStateChanged to call callback with null user
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(null)
      return vi.fn()
    })

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<AuthLayout authenticationRequired={true} />}>
            <Route path='/protected' element={<div>Protected</div>} />
          </Route>
          <Route path='/login' element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  it('renders protected content for authenticated users with verified email', async () => {
    const mockUser = {
      uid: 'u1',
      displayName: 'Ali',
      email: 'ali@example.com',
      emailVerified: true,
    }

    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(mockUser)
      return vi.fn()
    })

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<AuthLayout authenticationRequired={true} />}>
            <Route path='/protected' element={<div>Protected</div>} />
          </Route>
          <Route path='/login' element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Protected')).toBeInTheDocument()
    })
  })

  it('redirects authenticated users to dashboard on public routes', async () => {
    const mockUser = {
      uid: 'u1',
      displayName: 'Ali',
      email: 'ali@example.com',
      emailVerified: true,
    }

    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(mockUser)
      return vi.fn()
    })

    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route element={<AuthLayout authenticationRequired={false} />}>
            <Route path='/signup' element={<div>Signup Page</div>} />
          </Route>
          <Route path='/dashboard' element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    })
  })

  it('redirects users with unverified email to verify-email page', async () => {
    const mockUser = {
      uid: 'u1',
      displayName: 'Ali',
      email: 'ali@example.com',
      emailVerified: false,
    }

    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(mockUser)
      return vi.fn()
    })

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<AuthLayout authenticationRequired={true} />}>
            <Route path='/protected' element={<div>Protected</div>} />
          </Route>
          <Route path='/verify-email' element={<div>Verify Email Page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Verify Email Page')).toBeInTheDocument()
    })
  })
})
