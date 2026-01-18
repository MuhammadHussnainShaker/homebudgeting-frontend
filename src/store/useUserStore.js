import { create } from 'zustand'

// const demoUser = {
//   isAuthenticated: false,
//   userData: {
//     phoneNumber: '0303123456',
//     displayName: 'Name',
//   },
// }

const useUserStore = create((set) => ({
  user: {
    isAuthenticated: false,
    userData: null,
  },
  login: (data) => set({ user: { isAuthenticated: true, userData: data } }),
  logout: () => set({ user: { isAuthenticated: false, userData: null } }),
}))

export default useUserStore