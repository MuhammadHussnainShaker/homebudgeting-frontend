import yyyyMMToISODate from '@/utils/date-manipulators/yyyyMMToISODate'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// const demoMonth = '2026-01-01T00:00:00.000Z'

const useMonthStore = create()(
  persist(
    (set) => ({
      month: new Date().toISOString(),
      setMonth: (newMonth) => set({ month: yyyyMMToISODate(newMonth) }),
    }),
    {
      name: 'month-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useMonthStore
