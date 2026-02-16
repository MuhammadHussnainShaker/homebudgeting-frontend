import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// const demoUser = {
//   isAuthenticated: false,
//   userData: {
//     phoneNumber: '0303123456',
//     displayName: 'Name',
//   },
// }

const useUserStore = create()(
  persist(
    (set) => ({
      // Firebase user state
      firebaseUser: null,
      loading: true,
      
      // Backend user data (from /auth/bootstrap)
      user: {
        isAuthenticated: false,
        userData: null,
      },
      
      // Derived auth status: 'anonymous', 'pendingVerification', 'verified'
      getAuthStatus: (state) => {
        if (!state.firebaseUser) return 'anonymous'
        if (!state.firebaseUser.emailVerified) return 'pendingVerification'
        return 'verified'
      },
      
      // Set Firebase user (called by auth state listener)
      setFirebaseUser: (firebaseUser) => set({ firebaseUser, loading: false }),
      
      // Set loading state
      setLoading: (loading) => set({ loading }),
      
      // Login with backend user data (after bootstrap)
      login: (data) => set({ user: { isAuthenticated: true, userData: data } }),
      
      // Logout - clear all state
      logout: () => set({ 
        firebaseUser: null,
        user: { isAuthenticated: false, userData: null } 
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user?.userData
          ? {
              isAuthenticated: state.user.isAuthenticated,
              userData: {
                _id: state.user.userData._id,
                displayName: state.user.userData.displayName,
                isActive: state.user.userData.isActive,
              },
            }
          : state.user,
      }),
    },
  ),
)

// TODO: Handle "Hydration"

export default useUserStore
