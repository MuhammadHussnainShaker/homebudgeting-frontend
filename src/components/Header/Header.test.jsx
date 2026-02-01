import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import useUserStore from '../../store/useUserStore'
import Header from './Header'

describe('Header', () => {
  beforeEach(() => {
    useUserStore.setState({ user: { isAuthenticated: false, userData: null } })
  })

  function renderHeader() {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path='/'
            element={
              <>
                <Header />
                <div>Home</div>
              </>
            }
          />
          <Route path='/login' element={<div>Login Page</div>} />
          <Route path='/signup' element={<div>Signup Page</div>} />
          <Route
            path='/dashboard'
            element={
              <>
                <Header />
                <div>Dashboard Page</div>
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    )
  }

  it('shows public links when logged out', () => {
    renderHeader()

    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /dashboard/i }),
    ).not.toBeInTheDocument()
  })

  it('shows private links when logged in and navigates', () => {
    useUserStore.setState({
      user: {
        isAuthenticated: true,
        userData: { _id: 'u1', displayName: 'Ali', isActive: true },
      },
    })
    renderHeader()

    fireEvent.click(screen.getByRole('button', { name: /dashboard/i }))

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /login/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })
})
