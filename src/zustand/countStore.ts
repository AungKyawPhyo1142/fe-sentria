import { create } from 'zustand'

type CountStore = {
  count: number
  increment: () => void
  decrement: () => void
}

export const useCountStore = create<CountStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

export const selectCount = (state: CountStore) => state.count
export const increment = () => useCountStore.getState().increment()
export const decrement = () => useCountStore.getState().decrement()
