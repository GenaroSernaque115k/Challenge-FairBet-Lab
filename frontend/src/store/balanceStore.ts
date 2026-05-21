import { create } from 'zustand'

interface BalanceStore {
  balance: number
  setBalance: (balance: number) => void
}

export const useBalanceStore = create<BalanceStore>((set) => ({
  balance: 0,
  setBalance: (balance) => set({ balance }),
}))
