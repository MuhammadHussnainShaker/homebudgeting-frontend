import useUserStore from '../../store/useUserStore'

export default function LogoutBtn() {
  const logout = useUserStore((state) => state.logout)

  // TODO: create logout functionality on backend and use that to clear accessToken from cookies

  return <button onClick={logout}>Logout</button>
}
