import { Outlet } from 'react-router'
import useUserStore from './store/useUserStore'

function App() {
  const userInfo = useUserStore((state) => state.user)
  console.log('userInfo', userInfo)
  return (
    <>
    <div>
      <div>
        <header>Header</header>
        <Outlet />
        <footer>Footer</footer>
      </div>
    </div>
    </>
  )
}

export default App
