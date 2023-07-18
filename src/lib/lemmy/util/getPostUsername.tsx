import { ReactNode } from 'react'
import Avatar from '../../../components/Avatar'
import { BodyText } from '../../../components/Core/Text'
import { useAppSettingsStore } from '../../../stores/appSettingsStore'
import { router } from 'expo-router'

function AvatarWrapper({
  children,
  showAvatar,
  avatarUrl
}: {
  children: ReactNode
  showAvatar: boolean
  avatarUrl?: string
}) {
  return showAvatar ? (
    <>
      <Avatar size={16} placeholderIcon="User" src={avatarUrl} />
      {children}
    </>
  ) : (
    children
  )
}

export default function getPostUsername(
  post:
    | Lemmy.Data.PostData
    | Lemmy.Data.CommentData
    | Lemmy.Data.PrivateMessageData
) {
  const { showLocalUserServer, showUserAvatars, showFederatedUserServer } =
    useAppSettingsStore.getState()

  if (
    (post.creator.local && !showLocalUserServer) ||
    !showFederatedUserServer
  ) {
    return (
      <AvatarWrapper
        showAvatar={showUserAvatars}
        avatarUrl={post.creator.avatar}
      >
        <BodyText bold onPress={() => router.push(`/user/${post.creator.id}`)}>
          {post.creator.name}
        </BodyText>
      </AvatarWrapper>
    )
  }

  const url = new URL(post.creator.actor_id)
  return (
    <AvatarWrapper showAvatar={showUserAvatars} avatarUrl={post.creator.avatar}>
      <BodyText bold onPress={() => router.push(`/user/${post.creator.id}`)}>
        {post.creator.name}
        <BodyText color="$fadedText" tiny>
          @{url.hostname}
        </BodyText>
      </BodyText>
    </AvatarWrapper>
  )
}
