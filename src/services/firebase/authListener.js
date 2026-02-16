import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/services/firebase/firebaseClient'
import useUserStore from '@/store/useUserStore'

/**
 * Initialize Firebase auth state listener
 * Should be called once at app startup
 */
export function initializeAuthListener() {
  return onAuthStateChanged(auth, (firebaseUser) => {
    useUserStore.getState().setFirebaseUser(firebaseUser)
  })
}
