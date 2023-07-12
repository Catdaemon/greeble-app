import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { Stack, useFocusEffect } from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import { ActivityIndicator, TextInput as RootTextInput } from 'react-native'
import CommunitiesList from '../../../src/components/InfiniteList/CommunitiesList'
import { BodyText } from '../../../src/components/Core/Text'
import { View } from '../../../src/components/Core/View'
import PostsList from '../../../src/components/InfiniteList/PostsList'
import SegmentedButtonRow from '../../../src/components/SegmentedButtonRow'
import TextInput from '../../../src/components/TextInput'
import UsersList from '../../../src/components/InfiniteList/UsersList'
import ViewTypeSelector from '../../../src/components/ViewTypeSelector'
import { useLemmyInfiniteQuery } from '../../../src/lib/lemmy/rqHooks'
import { useTemporaryStore } from '../../../src/stores/temporaryStore'
import FullScreenLoader from '../../../src/components/Core/Loader/FullScreenLoader'
import queryKeys from '../../../src/lib/lemmy/rqKeys'

export default function Search() {
  const [viewType] = useTemporaryStore((store) => [store.viewType])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchTermInput, setSearchTermInput] = useState<string>('')
  const [activeTab, setActiveTab] =
    useState<Lemmy.Enums.SearchType>('Communities')

  const debouncedSetSearchTeam = useMemo(
    () => AwesomeDebouncePromise(setSearchTerm, 500),
    [setSearchTerm]
  )

  const {
    data,
    isLoading,
    fetchNextPage,
    refetch,
    isRefetching,
    isFetchingNextPage
  } = useLemmyInfiniteQuery(
    'search',
    [queryKeys.SEARCH, searchTerm, viewType, activeTab],
    {
      q: searchTerm,
      sort: 'Hot',
      limit: 10,
      listing_type: viewType,
      type_: activeTab
    }
  )

  const allPosts = useMemo(
    () => data?.pages?.flatMap((x) => x.posts),
    [data?.pages?.length]
  )
  const allUsers = useMemo(
    () => data?.pages?.flatMap((x) => x.users),
    [data?.pages?.length]
  )
  const allComments = useMemo(
    () => data?.pages?.flatMap((x) => x.comments),
    [data?.pages?.length]
  )
  const allCommunities = useMemo(
    () => data?.pages?.flatMap((x) => x.communities),
    [data?.pages?.length]
  )

  return (
    <View flex>
      <Stack.Screen
        options={{
          title: 'Search'
        }}
      />
      <View row centerV marginHorizontal="$0.5" gap="$1" marginTop="$1">
        <View flexGrow={1}>
          <TextInput
            placeholder="Enter search term"
            value={searchTermInput}
            onChangeText={(newVal) => {
              setSearchTermInput(newVal)
              debouncedSetSearchTeam(newVal)
            }}
          />
        </View>
        <View marginRight="$1">
          <ViewTypeSelector />
        </View>
      </View>
      <SegmentedButtonRow<Lemmy.Enums.SearchType>
        selectedId={activeTab}
        onSelectedChanged={(id) => setActiveTab(id)}
        options={[
          {
            id: 'Communities',
            label: 'Communities'
          },
          {
            id: 'Posts',
            label: 'Posts'
          },
          {
            id: 'Users',
            label: 'Users'
          }
          // {
          //   id: 'Comments',
          //   label: 'Comments'
          // }
          // {
          //   id: 'Url',
          //   label: 'Link'
          // }
        ]}
      />
      <View flex>
        {searchTermInput.length < 3 ? (
          <BodyText></BodyText>
        ) : isLoading ? (
          <FullScreenLoader />
        ) : activeTab === 'Posts' ? (
          <PostsList
            data={allPosts}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            isRefetching={isRefetching}
            refetch={refetch}
          />
        ) : activeTab === 'Communities' ? (
          <CommunitiesList
            data={allCommunities}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            isRefetching={isRefetching}
            refetch={refetch}
          />
        ) : activeTab === 'Users' ? (
          <UsersList
            data={allUsers}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            isRefetching={isRefetching}
            refetch={refetch}
          />
        ) : null}
      </View>
    </View>
  )
}
