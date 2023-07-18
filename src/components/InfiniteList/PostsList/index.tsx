import getPostCommunityName from '../../../lib/lemmy/util/getPostCommunityName'
import getPostUsername from '../../../lib/lemmy/util/getPostUsername'
import InfiniteList, { InfiniteListImplementation } from '..'
import Post from '../../Post'
import { router } from 'expo-router'

function renderPost(data: Lemmy.Data.PostData, index: number) {
  return (
    <Post
      id={data.post.id.toString()}
      title={data.post.name}
      author={getPostUsername(data)}
      authorId={data.post.creator_id}
      community={getPostCommunityName(data)}
      communityId={data.post.community_id}
      read={data.read}
      counts={{
        upvotes: data.counts.upvotes,
        downvotes: data.counts.downvotes,
        replies: data.counts.comments
      }}
      imageUrl={data.post.thumbnail_url}
      linkUrl={data.post.url}
      videoUrl={data.post.embed_video_url}
      isNsfw={data.post.nsfw}
      date={data.post.updated ?? data.post.published}
      onPress={() => router.push(`/comments/${data.post.id}`)}
    />
  )
}

export interface PostsListProps
  extends InfiniteListImplementation<Lemmy.Data.PostData> {}

export default function PostsList(props: PostsListProps) {
  return (
    <InfiniteList
      {...props}
      estimatedItemSize={125}
      renderItem={renderPost}
      keyExtractor={(item) => `post-${item.post.ap_id}${(item as any).page}`}
    />
  )
}
