import { Outlet } from 'react-router'
import useUserStore from './store/useUserStore'
import { useState } from 'react'
import { Footer, Header } from './components'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const userInfo = useUserStore((state) => state.user)
  console.log('userInfo', userInfo)

  return isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <div >
        <div >
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App
