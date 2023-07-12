import { router } from 'expo-router'
import { Pressable } from 'react-native'
import InfiniteList, { InfiniteListImplementation } from '..'
import UserCard from '../../UserCard'

function renderItem(data: Lemmy.Data.PersonData, index: number) {
  return (
    <Pressable onPress={() => router.push(`/user/${data.person.id}`)}>
      <UserCard personData={data} />
    </Pressable>
  )
}

export interface UsersListProps
  extends InfiniteListImplementation<Lemmy.Data.PersonData> {}

export default function UsersList(props: UsersListProps) {
  return (
    <InfiniteList
      {...props}
      estimatedItemSize={132}
      renderItem={renderItem}
      keyExtractor={(item) =>
        `user-${item.person.actor_id}${(item as any).page}`
      }
    />
  )
}
