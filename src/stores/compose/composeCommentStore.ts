import { create } from 'zustand'

export interface ComposeCommentStoreState {
  editingId?: string
  replyingToComment?: Lemmy.Data.CommentData
  replyingToPost?: Lemmy.Data.PostData
  message: string
}

export interface ComposeCommentStoreActions {
  clear: () => void
  setMessage: (message: string) => void
}

const defaultState: ComposeCommentStoreState = {
  message: ''
}

type ComposeCommentStore = ComposeCommentStoreActions & ComposeCommentStoreState

export const useComposeCommentStore = create<ComposeCommentStore>()(
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
