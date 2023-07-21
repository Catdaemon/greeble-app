import { Stack, router } from 'expo-router'
import { View } from '../../../src/components/Core/View'
import useActiveAccount from '../../../src/hooks/useActiveAccount'
import {
  useLemmyInfiniteQuery,
  useLemmyQuery
} from '../../../src/lib/lemmy/rqHooks'
import { BodyText } from '../../../src/components/Core/Text'
import InfiniteList from '../../../src/components/InfiniteList'
import { useMemo, useState } from 'react'
import SegmentedButtonRow from '../../../src/components/SegmentedButtonRow'
import Message from '../../../src/components/Message'
import getPostUsername from '../../../src/lib/lemmy/util/getPostUsername'
import { useComposeMessageStore } from '../../../src/stores/compose/composeMessageStore'
import queryKeys from '../../../src/lib/lemmy/rqKeys'
import useActiveAccountData from '../../../src/hooks/useActiveAccountData'
import FullScreenLoader from '../../../src/components/Core/Loader/FullScreenLoader'
import CommentsList from '../../../src/components/InfiniteList/CommentsList'

type ValidTabId = 'sent' | 'received' | 'mentions' | 'replies'

function RenderMessageRow(
  item: Lemmy.Data.PrivateMessageData,
  isSentTab: boolean
) {
  const onReply = () => {
    useComposeMessageStore.setState({
      message: '',
      replyingTo: item,
      toUser: item.creator
    })
    router.push('/message/compose')
  }

  return (
    <Message
      id={item.private_message.id}
      author={
        isSentTab
          ? getPostUsername({
              ...item,
              creator: item.recipient ?? item.creator
            })
          : getPostUsername(item)
      }
      body={item.private_message.content}
      date={item.private_message.published}
      onActionPerformed={() => {}}
      onReplyPressed={onReply}
    />
  )
}

function RenderMessages({ tab }: { tab: ValidTabId }) {
  const activeAccount = useActiveAccount()
  const myAccountData = useActiveAccountData()
  const myUserId = myAccountData?.accountData?.person?.id

  const { data, isFetching, isLoading, refetch, isRefetching, fetchNextPage } =
    useLemmyInfiniteQuery(
      'getPrivateMessages',
      [queryKeys.MESSAGES, activeAccount.accountID],
      {
        limit: 50
      }
    )

  const allData = useMemo(
    () => data?.pages.flatMap((x) => x.private_messages) ?? [],
    [data]
  )

  const sentMessages = useMemo(
    () => allData.filter((x) => x.creator.id === myUserId),
    [allData]
  )
  const receivedMessages = useMemo(
    () => allData.filter((x) => x.creator.id !== myUserId),
    [allData]
  )

  const messagesToShow = tab === 'sent' ? sentMessages : receivedMessages

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <View flex>
      {messagesToShow.length < 1 ? (
        <View flex center>
          <BodyText>No messages to display.</BodyText>
        </View>
      ) : (
        <InfiniteList<Lemmy.Data.PrivateMessageData>
          data={messagesToShow}
          keyExtractor={(item) => item.private_message.id}
          renderItem={(item, index) => RenderMessageRow(item, tab === 'sent')}
          isLoading={isLoading || isFetching}
          isRefetching={isRefetching}
          fetchNextPage={fetchNextPage}
          refetch={refetch}
          estimatedItemSize={10}
        />
      )}
    </View>
  )
}

function RenderMentions() {
  const activeAccount = useActiveAccount()

  const { data, isFetching, isLoading, refetch, isRefetching, fetchNextPage } =
    useLemmyInfiniteQuery(
      'getMentions',
      [queryKeys.MENTIONS, activeAccount.accountID],
      {
        limit: 50
      }
    )

  const allMentions = useMemo(
    () => data?.pages.flatMap((x) => x.mentions) ?? [],
    [data]
  )

  console.log(allMentions)

  return <BodyText></BodyText>
}

function RenderReplies() {
  const activeAccount = useActiveAccount()

  const { data, isFetching, isLoading, refetch, isRefetching, fetchNextPage } =
    useLemmyInfiniteQuery(
      'getReplies',
      [queryKeys.USERREPLIES, activeAccount.accountID],
      {
        limit: 50
      }
    )

  const allReplies = useMemo(
    () => data?.pages.flatMap((x) => x.replies) ?? [],
    [data]
  )

  console.log(allReplies.length)

  return (
    <View flex>
      <CommentsList
        flattenTree
        data={allReplies}
        onCommentActionPerformed={() => {}}
        isLoading={isLoading || isFetching}
        isRefetching={isRefetching}
        fetchNextPage={fetchNextPage}
        refetch={refetch}
      />
    </View>
  )
}

export default function Messages() {
  const [tab, setTab] = useState<ValidTabId>('received')

  return (
    <View flex>
      <Stack.Screen options={{ title: 'Messages' }} />
      <SegmentedButtonRow<ValidTabId>
        options={[
          { label: 'Received', id: 'received' },
          { label: 'Sent', id: 'sent' },
          { label: 'Mentions', id: 'mentions' },
          { label: 'Replies', id: 'replies' }
        ]}
        selectedId={tab}
        onSelectedChanged={(newVal) => setTab(newVal)}
      />
      {tab === 'mentions' ? (
        <RenderMentions />
      ) : tab === 'replies' ? (
        <RenderReplies />
      ) : (
        <RenderMessages tab={tab} />
      )}
    </View>
  )
}
