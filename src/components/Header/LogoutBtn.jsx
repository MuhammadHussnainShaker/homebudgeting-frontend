import useUserStore from '../../store/useUserStore'

export default function LogoutBtn() {
  const logout = useUserStore((state) => state.logout)

  return <button onClick={logout}>Logout</button>
}
