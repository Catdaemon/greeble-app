import { formatDistanceStrict } from 'date-fns'
import { router } from 'expo-router'
import { ReactNode, useMemo } from 'react'
import { Pressable } from 'react-native'
import { useAppSettingsStore } from '../../../src/stores/appSettingsStore'
import getLinkInfo from '../../lib/getLinkInfo'
import { LinkType } from '../../lib/lemmy/linkInfoTypes'
import { BodyText, TitleText } from '../Core/Text'
import { View } from '../Core/View'
import MarkdownView from '../MarkdownView'
import PostThumbnail from '../PostThumbnail'
import TextWithIcon from '../TextWithIcon'

export interface PostProps {
  id: string
  title: string
  imageUrl?: string
  linkUrl?: string
  videoUrl?: string
  date?: string
  read?: boolean
  community: ReactNode
  communityId?: string
  author: ReactNode
  authorId?: string
  isNsfw: boolean
  body?: string
  renderBody?: boolean
  cardView?: boolean
  counts?: {
    upvotes: number
    downvotes: number
    replies: number
  }
  onPress?: () => void
}

export default function Post({
  id,
  title,
  community,
  communityId,
  author,
  authorId,
  imageUrl,
  linkUrl,
  videoUrl,
  counts,
  isNsfw,
  body,
  renderBody,
  date,
  cardView,
  read,
  onPress
}: PostProps) {
  const [
    allowNsfw,
    blurNsfw,
    postAuthorInFeed,
    showUrl,
    cardIsSetting,
    titleAtTop,
    postThumbnailRight
  ] = useAppSettingsStore((store) => [
    store.allowNsfw,
    store.blurNsfw,
    store.postAuthorInFeed,
    store.showPostUrl,
    store.postListCardView,
    store.postTitleAtTop,
    store.postThumbnailRight
  ])

  const linkInfo = useMemo(() => linkUrl && getLinkInfo(linkUrl), [linkUrl])

  if (isNsfw && !allowNsfw) {
    return null
  }

  const showAsCard =
    (cardView || cardIsSetting) &&
    !!linkInfo &&
    (linkInfo?.type !== LinkType.Link || imageUrl)

  const thumbnail = (
    <PostThumbnail
      linkUrl={linkUrl}
      imageUrl={imageUrl}
      videoUrl={videoUrl}
      blur={isNsfw && blurNsfw}
      thumbSize={showAsCard ? '100%' : undefined}
      contain={false}
      square={!showAsCard}
    />
  )

  const card = (
    <View
      padding="$0.5"
      backgroundColor="$contentBackground"
      marginBottom="$0.25"
      opacity={!renderBody && read ? 0.5 : 1}
    >
      {titleAtTop && showAsCard && (
        <TitleText marginBottom="$1">{title}</TitleText>
      )}
      <View flex flexDirection={showAsCard ? 'column' : 'row'} gap="$1">
        {(showAsCard || !postThumbnailRight) && thumbnail}
        <View flex gap="$0.5" spread>
          <View>
            {(!titleAtTop || !showAsCard) && <TitleText>{title}</TitleText>}
            <BodyText color="$fadedText" numberOfLines={1}>
              {(showUrl ? linkUrl : linkInfo?.domain) ?? 'Text'}
            </BodyText>
          </View>
          <View row justifyContent={!showAsCard ? 'flex-end' : undefined}>
            {postAuthorInFeed || renderBody ? (
              <BodyText color="$fadedText">
                <BodyText onPress={() => router.push(`/user/${authorId}`)}>
                  {author}
                </BodyText>{' '}
                in{' '}
                <BodyText
                  bold
                  onPress={() => router.push(`/community/${communityId}`)}
                >
                  {community}
                </BodyText>
              </BodyText>
            ) : (
              <BodyText
                bold
                onPress={() => router.push(`/community/${communityId}`)}
              >
                {community}
              </BodyText>
            )}
          </View>
        </View>
        {!showAsCard && postThumbnailRight && thumbnail}
      </View>
      {body && renderBody && (
        <View
          borderTopColor="$fadedText"
          borderTopWidth={1}
          marginTop="$0.5"
          paddingTop="$0.5"
        >
          <MarkdownView content={body} />
        </View>
      )}
      <View row marginTop="$0.5">
        {counts && (
          <View flex row gap="$0.5" width={200}>
            <TextWithIcon icon="ThumbsUp" text={counts.upvotes.toString()} />
            <TextWithIcon
              icon="ThumbsDown"
              text={counts.downvotes.toString()}
            />
            <TextWithIcon
              icon="MessagesSquare"
              text={counts.replies.toString()}
            />
          </View>
        )}
        {date && (
          <View gap="$0.5" row alignItems="flex-end">
            <TextWithIcon
              icon="Clock"
              text={formatDistanceStrict(new Date(date), new Date(), {
                addSuffix: false
              })}
            />
          </View>
        )}
      </View>
    </View>
  )

  return onPress === undefined ? (
    card
  ) : (
    <Pressable onPress={onPress}>{card}</Pressable>
  )
}
