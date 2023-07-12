import { create } from 'zustand'

type ViewType = 'All' | 'Local' | 'Subscribed'

export interface TemporaryStoreState {
  viewType: ViewType
}

export interface TemporaryStoreActions {
  setViewType: (type: ViewType) => void
  clear: () => void
}

const defaultState: TemporaryStoreState = {
  viewType: 'Local'
}

type TemporaryStore = TemporaryStoreState & TemporaryStoreActions

export const useTemporaryStore = create<TemporaryStore>()((set, get) => ({
  ...defaultState,
  setViewType: (type: ViewType) => {
    set((state) => ({
      viewType: type
    }))
  },
  clear: () => {
    set(defaultState)
  }
}))
