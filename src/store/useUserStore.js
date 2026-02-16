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
      user: {
        isAuthenticated: false,
        userData: null,
      },
      login: (data) => set({ user: { isAuthenticated: true, userData: data } }),
      logout: () => set({ user: { isAuthenticated: false, userData: null } }),
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
                email: state.user.userData.email,
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
