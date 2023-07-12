import AsyncStore from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface AppSettingsStoreState {
  allowNsfw: boolean
  blurNsfw: boolean
  darkMode: boolean
  darkModeAuto: boolean
  showLocalUserServer: boolean
  showLocalCommunityServer: boolean
  showFederatedUserServer: boolean
  showFederatedCommunityServer: boolean
  inlineCommentImages: boolean
  loadPostImages: boolean
  postAuthorInFeed: boolean
  defaultCollapseChildren: boolean
  showCommentLinkBlock: boolean
  showPostUrl: boolean
  openLinksInApp: boolean
  postListCardView: boolean
  showUserAvatars: boolean
  postTitleAtTop: boolean
  postThumbnailRight: boolean

  leftCommentActions: boolean
  leftCommentUpvote: boolean
  leftCommentDownvote: boolean
  leftCommentBookmark: boolean
  leftCommentReply: boolean

  rightCommentActions: boolean
  rightCommentUpvote: boolean
  rightCommentDownvote: boolean
  rightCommentBookmark: boolean
  rightCommentReply: boolean
}

type SetSettingFunction<T extends keyof AppSettingsStoreState> = (
  settingName: T,
  settingValue: AppSettingsStoreState[T]
) => void

export interface AppSettingStoreActions {
  setSettingValue: SetSettingFunction<keyof AppSettingsStoreState>
  clear: () => void
}

const defaultState: AppSettingsStoreState = {
  allowNsfw: false,
  blurNsfw: true,
  darkMode: false,
  darkModeAuto: true,
  showLocalUserServer: false,
  showLocalCommunityServer: false,
  showFederatedUserServer: false,
  showFederatedCommunityServer: false,
  inlineCommentImages: false,
  loadPostImages: true,
  postAuthorInFeed: false,
  defaultCollapseChildren: false,
  showCommentLinkBlock: true,
  showPostUrl: false,
  openLinksInApp: true,
  postListCardView: false,
  showUserAvatars: true,
  postTitleAtTop: false,
  postThumbnailRight: false,

  leftCommentActions: false,
  leftCommentUpvote: false,
  leftCommentDownvote: false,
  leftCommentReply: false,
  leftCommentBookmark: false,

  rightCommentActions: true,
  rightCommentUpvote: true,
  rightCommentDownvote: false,
  rightCommentReply: true,
  rightCommentBookmark: false
}

type AppSettingsStore = AppSettingsStoreState & AppSettingStoreActions

export const useAppSettingsStore = create<AppSettingsStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setSettingValue: (settingName, settingValue) => {
        set((state) => ({
          [settingName]: settingValue
        }))
      },
      clear: () => {
        set(defaultState)
      }
    }),
    {
      name: 'app-settings-store',
      storage: createJSONStorage(() => AsyncStore)
    }
  )
)
