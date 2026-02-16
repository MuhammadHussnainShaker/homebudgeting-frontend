import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}))

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
}))

vi.mock('firebase/auth', () => {
  const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: true,
  }

  return {
    getAuth: vi.fn(() => ({
      currentUser: mockUser,
    })),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    sendEmailVerification: vi.fn(),
    updateProfile: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
      // Return unsubscribe function
      return vi.fn()
    }),
  }
})

vi.mock('@firebase-oss/ui-core', () => ({
  initializeUI: vi.fn(() => ({})),
}))

vi.mock('@firebase-oss/ui-react', () => ({
  FirebaseUIProvider: ({ children }) => children,
}))
