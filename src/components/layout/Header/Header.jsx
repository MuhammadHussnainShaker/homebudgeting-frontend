import { Link, useNavigate } from 'react-router'
import Container from '../container/Container'
import useUserStore from '../../../store/useUserStore'
import LogoutBtn from './LogoutBtn'

export default function Header() {
  const isAuthenticated = useUserStore((state) => state.user.isAuthenticated)
  const navigate = useNavigate()

  const navItems = [
    { name: 'Signup', slug: '/signup', active: !isAuthenticated },
    { name: 'Login', slug: '/login', active: !isAuthenticated },
    { name: 'Dashboard', slug: '/dashboard', active: isAuthenticated },
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
    { name: 'Profile', slug: '/user-profile', active: isAuthenticated },
  ]

  return (
    <header className='border-b border-slate-700/50'>
      <Container>
        <nav className='flex flex-wrap items-center justify-between gap-3 py-3'>
          <Link to='/' className='font-medium'>
            Home Budgeting
          </Link>

          <ul className='flex flex-wrap items-center justify-end gap-2'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    className='px-3 py-1.5 rounded border border-slate-700/50'
                    onClick={() => navigate(item.slug)}
                  >
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
