import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import useUserStore from '../../store/useUserStore'
import LogoutBtn from './LogoutBtn'

describe('LogoutBtn', () => {
  beforeEach(() => {
    useUserStore.setState({
      user: {
        isAuthenticated: true,
        userData: { _id: 'u1', displayName: 'Ali', isActive: true },
      },
    })
  })

  it('calls logout from the store on click', () => {
    const logoutMock = vi.fn()
    useUserStore.setState({ logout: logoutMock })

    render(<LogoutBtn />)

    fireEvent.click(screen.getByRole('button', { name: /logout/i }))

    expect(logoutMock).toHaveBeenCalledTimes(1)
  })
})
