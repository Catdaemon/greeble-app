import { Stack } from 'expo-router'
import { View } from '../../../src/components/Core/View'
import useActiveAccountData from '../../../src/hooks/useActiveAccountData'
import FullScreenLoader from '../../../src/components/Core/Loader/FullScreenLoader'
import { useState } from 'react'
import SegmentedButtonRow from '../../../src/components/SegmentedButtonRow'
import CommunitiesList from '../../../src/components/InfiniteList/CommunitiesList'
import { ScrollView } from 'tamagui'
import { Scroll } from 'lucide-react-native'
import CardRow from '../../../src/components/CardRow'
import { BodyText } from '../../../src/components/Core/Text'
import Icon from '../../../src/components/Icon'
import { Pressable } from 'react-native'
import Button from '../../../src/components/Core/Button'
import { useLemmyMutation } from '../../../src/lib/lemmy/rqHooks'
import queryKeys from '../../../src/lib/lemmy/rqKeys'
import useActiveAccount from '../../../src/hooks/useActiveAccount'

type ValidTabId = 'users' | 'communities'

export default function BlockListScreen() {
  const { blockedPeople, blockedCommunities, isLoading } =
    useActiveAccountData()
  const activeAccount = useActiveAccount()
  const { mutateAsync: blockCommunity, isLoading: communityBlockLoading } =
    useLemmyMutation('blockCommunity', [
      queryKeys.SITE,
      activeAccount.accountID
    ])
  const { mutateAsync: blockUser, isLoading: userBlockLoading } =
    useLemmyMutation('blockUser', [queryKeys.SITE, activeAccount.accountID])

  const [tab, setTab] = useState<ValidTabId>('users')

  return (
    <View flex>
      <Stack.Screen
        options={{
          title: 'Block List'
        }}
      />
      {isLoading || userBlockLoading || communityBlockLoading ? (
        <FullScreenLoader />
      ) : (
        <View flex>
          <SegmentedButtonRow<ValidTabId>
            selectedId={tab}
            onSelectedChanged={setTab}
            options={[
              {
                id: 'users',
                label: 'Users'
              },
              {
                id: 'communities',
                label: 'Communities'
              }
            ]}
          />
          {tab === 'users' ? (
            <ScrollView style={{ flex: 1 }}>
              {blockedPeople.map((user) => (
                <CardRow
                  key={user.person.actor_id}
                  left={<Icon name="Ban" />}
                  center={<BodyText>{user.person.actor_id}</BodyText>}
                  right={
                    <Button
                      variant="primary"
                      label="Unblock"
                      onPress={() => {
                        blockUser({
                          person_id: user.person.id,
                          block: false
                        })
                      }}
                    />
                  }
                />
              ))}
            </ScrollView>
          ) : (
            <ScrollView style={{ flex: 1 }}>
              {blockedCommunities.map((community) => (
                <CardRow
                  key={community.community.actor_id}
                  left={<Icon name="Ban" />}
                  center={<BodyText>{community.community.actor_id}</BodyText>}
                  right={
                    <Button
                      variant="primary"
                      label="Unblock"
                      onPress={() => {
                        blockCommunity({
                          community_id: community.community.id,
                          block: false
                        })
                      }}
                    />
                  }
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  )
}
