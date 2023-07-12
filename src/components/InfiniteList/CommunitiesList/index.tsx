import { Pressable } from 'react-native'
import CommunityCard from '../../CommunityCard'
import InfiniteList, { InfiniteListImplementation } from '..'
import { router } from 'expo-router'

function renderItem(data: Lemmy.Data.CommunityData, index: number) {
  return (
    <Pressable onPress={() => router.push(`/community/${data.community.id}`)}>
      <CommunityCard communityData={data} />
    </Pressable>
  )
}

export interface CommunitiesListProps
  extends InfiniteListImplementation<Lemmy.Data.CommunityData> {}

export default function CommunitiesList(props: CommunitiesListProps) {
  return (
    <InfiniteList
      {...props}
      renderItem={renderItem}
      keyExtractor={(item) => `community-${item.community.id}`}
      estimatedItemSize={132}
    />
  )
}
