import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import {
  Home,
  Signup,
  Login,
  Dashboard,
  MonthlyExpenses,
  DailyExpenses,
  UserProfile,
  VerifyEmail,
} from '@/pages/index.js'
import { AuthLayout } from '@/components/index.js'
import { FirebaseUIProvider } from '@firebase-oss/ui-react'
import { ui } from '@/services/firebase/firebaseClient'

const root = document.getElementById('root')

createRoot(root).render(
  <StrictMode>
    <FirebaseUIProvider ui={ui}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<Home />} />

            {/* Public routes */}
            <Route element={<AuthLayout authenticationRequired={false} />}>
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />
            </Route>

            {/* Email verification route */}
            <Route path='/verify-email' element={<VerifyEmail />} />

            {/* Private routes */}
            <Route element={<AuthLayout authenticationRequired={true} />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/monthly-expenses' element={<MonthlyExpenses />} />
              <Route path='/daily-expenses' element={<DailyExpenses />} />
              <Route path='/user-profile' element={<UserProfile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </FirebaseUIProvider>
  </StrictMode>,
)
