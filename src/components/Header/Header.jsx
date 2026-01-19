import { Link, useNavigate } from 'react-router'
import Container from '../container/Container'
import useUserStore from '../../store/useUserStore'
import LogoutBtn from './LogoutBtn'

export default function Header() {
  const isAuthenticated = useUserStore((state) => state.user.isAuthenticated)
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'Signup',
      slug: '/signup',
      active: !isAuthenticated,
    },
    {
      name: 'Login',
      slug: '/login',
      active: !isAuthenticated,
    },
    {
      name: 'Dashboard',
      slug: '/dashboard',
      active: isAuthenticated,
    },
    {
      name: 'Monthly Expenses',
      slug: '/monthly-expenses',
      active: isAuthenticated,
    },
    {
      name: 'Daily Expenses',
      slug: '/daily-expenses',
      active: isAuthenticated,
    },
    {
      name: 'Profile',
      slug: '/user-profile',
      active: isAuthenticated,
    },
  ]

  return (
    <header>
      <Container>
        <nav className='flex'>
          <div>
            <Link to='/'>Home</Link>
          </div>
          <ul className='flex'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button onClick={() => navigate(item.slug)}>
                    {item.name}
                  </button>
                </li>
              ) : null,
            )}
            {isAuthenticated && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
