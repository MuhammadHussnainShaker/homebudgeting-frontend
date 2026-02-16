import { signOut } from 'firebase/auth'
import { auth } from '@/services/firebase/firebaseClient'
import useUserStore from '@/store/useUserStore'

export default function LogoutBtn() {
  const logout = useUserStore((state) => state.logout)

  async function handleLogout() {
    try {
      await signOut(auth)
      logout()
    } catch (error) {
      console.error('Error signing out:', error)
      // Still logout from store even if Firebase sign out fails
      logout()
    }
  }

  return (
    <button
      className='px-3 py-1.5 rounded border border-slate-700/50'
      onClick={handleLogout}
    >
      Logout
    </button>
  )
}
