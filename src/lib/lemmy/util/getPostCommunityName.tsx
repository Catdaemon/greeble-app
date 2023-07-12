import { BodyText } from '../../../components/Core/Text'
import { useAppSettingsStore } from '../../../stores/appSettingsStore'

export default function getPostCommunityName(post: Lemmy.Data.PostData) {
  const { showLocalCommunityServer, showFederatedCommunityServer } =
    useAppSettingsStore.getState()

  if (
    (post.community.local && !showLocalCommunityServer) ||
    !showFederatedCommunityServer
  ) {
    return <BodyText bold>{post.community.name}</BodyText>
  }
  const url = new URL(post.community.actor_id)
  return (
    <BodyText bold>
      {post.community.name}
      <BodyText tiny>@{url.hostname}</BodyText>
    </BodyText>
  )
}
