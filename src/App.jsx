import { Outlet, useNavigate } from 'react-router'
import useUserStore from './store/useUserStore'
import { useEffect, useState } from 'react'
import { Footer, Header } from './components'

function App() {
  // const [isLoading, setIsLoading] = useState(true)
  // const userInfo = useUserStore((state) => state.user)
  // console.log('userInfo', userInfo)
  // const navigate = useNavigate()

  // useEffect(()=>{
  //   if (userInfo.isAuthenticated) {
  //     navigate('/dashboard')
  //     setIsLoading(false)
  //   } else {
  //     navigate('/')
  //     setIsLoading(false)
  //   }
  // },[])

  return (
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
