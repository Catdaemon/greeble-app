import { Stack } from 'expo-router'
import { ScrollView } from 'tamagui'
import AppSetting from '../../../src/components/AppSetting'
import { HeadingText } from '../../../src/components/Core/Text'
import { View } from '../../../src/components/Core/View'
import { useAppSettingsStore } from '../../../src/stores/appSettingsStore'

export default function InterfaceSettings() {
  const [leftCommentActions, rightCommentActions] = useAppSettingsStore(
    (state) => [state.leftCommentActions, state.rightCommentActions]
  )

  return (
    <ScrollView padding="$0.5">
      <View gap="$0.5">
        <Stack.Screen options={{ title: 'Interface' }} />

        <HeadingText marginVertical="$1">Convenience</HeadingText>

        <AppSetting
          label="Collapse child comments by default"
          setting="defaultCollapseChildren"
          icon="FoldVertical"
        />

        <AppSetting
          label="Show link block after text blocks"
          setting="showCommentLinkBlock"
          icon="LayoutPanelTop"
        />

        <AppSetting
          label="Open links in-app"
          setting="openLinksInApp"
          icon="Compass"
        />

        <HeadingText marginVertical="$1">Comment swipe actions</HeadingText>

        <AppSetting
          label="Left comment actions"
          setting="leftCommentActions"
          icon="ArrowLeftSquare"
        />
        {leftCommentActions && (
          <View marginLeft="$2">
            <AppSetting
              label="Upvote"
              setting="leftCommentUpvote"
              icon="ThumbsUp"
            />
            <AppSetting
              label="Downvote"
              setting="leftCommentDownvote"
              icon="ThumbsDown"
            />
            <AppSetting label="Reply" setting="leftCommentReply" icon="Reply" />
            <AppSetting
              label="Bookmark"
              setting="leftCommentBookmark"
              icon="Bookmark"
            />
          </View>
        )}
        <AppSetting
          label="Right comment actions"
          setting="rightCommentActions"
          icon="ArrowRightSquare"
        />
        {rightCommentActions && (
          <View marginLeft="$2">
            <AppSetting
              label="Upvote"
              setting="rightCommentUpvote"
              icon="ThumbsUp"
            />
            <AppSetting
              label="Downvote"
              setting="rightCommentDownvote"
              icon="ThumbsDown"
            />
            <AppSetting
              label="Reply"
              setting="rightCommentReply"
              icon="Reply"
            />
            <AppSetting
              label="Bookmark"
              setting="rightCommentBookmark"
              icon="Bookmark"
            />
          </View>
        )}
      </View>
    </ScrollView>
  )
}
