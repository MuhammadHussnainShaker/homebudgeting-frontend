import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { signOut } from 'firebase/auth'
import useUserStore from '@/store/useUserStore'
import LogoutBtn from '@/components/layout/Header/LogoutBtn'

describe('LogoutBtn', () => {
  beforeEach(() => {
    useUserStore.setState({
      user: {
        isAuthenticated: true,
        userData: { _id: 'u1', displayName: 'Ali', isActive: true },
      },
    })
    vi.clearAllMocks()
  })

  it('calls logout from the store and Firebase signOut on click', async () => {
    const logoutMock = vi.fn()
    useUserStore.setState({ logout: logoutMock })
    
    vi.mocked(signOut).mockResolvedValue()

    render(<LogoutBtn />)

    fireEvent.click(screen.getByRole('button', { name: /logout/i }))

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1)
      expect(logoutMock).toHaveBeenCalledTimes(1)
    })
  }, 20000)
})
