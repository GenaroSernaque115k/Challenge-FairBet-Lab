import { create } from 'zustand'

interface BalanceStore {
  balance: number
  bonusBalance: number
  setBalance: (balance: number) => void
  setBonusBalance: (balance: number) => void
}

export const useBalanceStore = create<BalanceStore>((set) => ({
  balance: 0,
  bonusBalance: 0,
  setBalance: (balance) => set({ balance }),
  setBonusBalance: (bonusBalance) => set({ bonusBalance }),
}))
