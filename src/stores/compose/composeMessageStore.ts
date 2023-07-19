import { create } from 'zustand'

export interface ComposeMessageStoreState {
  toUser: Lemmy.Objects.Person | null
  replyingTo?: Lemmy.Data.PrivateMessageData
  message: string
}

export interface ComposeMessageStoreActions {
  clear: () => void
  setMessage: (message: string) => void
}

const defaultState: ComposeMessageStoreState = {
  toUser: null,
  message: ''
}

type ComposeMessageStore = ComposeMessageStoreState & ComposeMessageStoreActions

export const useComposeMessageStore = create<ComposeMessageStore>()(
  (set, get) => ({
    ...defaultState,
    clear: () => {
      set(defaultState)
    },
    setMessage: (message: string) => {
      set((state) => ({
        message
      }))
    }
  })
)
