import { Stack, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Popover, ScrollView } from 'tamagui'
import AccountRow from '../../../src/components/AccountRow'
import Avatar from '../../../src/components/Avatar'
import Card from '../../../src/components/Card'
import { BodyText, HeadingText } from '../../../src/components/Core/Text'
import { View } from '../../../src/components/Core/View'
import Icon from '../../../src/components/Icon'
import useActiveAccount from '../../../src/hooks/useActiveAccount'
import { useLemmyQuery } from '../../../src/lib/lemmy/rqHooks'
import { Account, useAccountStore } from '../../../src/stores/accountStore'
import queryKeys from '../../../src/lib/lemmy/rqKeys'
import CardRow from '../../../src/components/CardRow'
import AccountSwitcher from '../../../src/components/AccountSwitcher'
import { Pressable } from 'react-native'
import SegmentedButtonRow from '../../../src/components/SegmentedButtonRow'
import TextWithIcon from '../../../src/components/TextWithIcon'
import pluraliseNumber from '../../../src/lib/pluraliseNumber'

export default function AccountScreen() {
  const router = useRouter()
  const activeAccount = useActiveAccount()

  const { data: myAccountData } = useLemmyQuery(
    'getSite',
    [queryKeys.SITE, activeAccount.accountID],
    {}
  )

  const [switcherOpen, setSwitcherOpen] = useState(false)

  return (
    <View flex padding="$0.5">
      <Stack.Screen
        options={{
          title: 'Account',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/tabs/account/add')}>
              <Icon name="Plus" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <AccountSwitcher
              open={switcherOpen}
              onOpenChanged={setSwitcherOpen}
              button={
                <Pressable onPress={() => setSwitcherOpen(true)}>
                  <Icon name="ArrowRightLeft" />
                </Pressable>
              }
              placement="bottom"
            />
          )
        }}
      />
      <ScrollView flex={1}>
        {activeAccount && (
          <>
            <Card center padding="$1" marginBottom="$0.5" gap="$1">
              <HeadingText>Active account</HeadingText>
              {!activeAccount.token ? (
                <Icon name="VenetianMask" size="$4" color="$fadedText" />
              ) : (
                <Avatar
                  size={96}
                  src={myAccountData?.my_user?.local_user_view.person.avatar}
                  placeholderIcon="User"
                />
              )}
              <View center>
                <HeadingText>{activeAccount.username}</HeadingText>
                <BodyText>{new URL(activeAccount.serverURL).hostname}</BodyText>
              </View>
              <View gap="$0.5" width="100%">
                <View row justifyContent="space-between">
                  <TextWithIcon
                    icon="MessagesSquare"
                    text={`${
                      myAccountData.my_user.local_user_view.counts.comment_count
                    } ${pluraliseNumber(
                      myAccountData.my_user.local_user_view.counts
                        .comment_count,
                      'comment',
                      'comments'
                    )}`}
                  />
                  <TextWithIcon
                    icon="Mail"
                    text={`${
                      myAccountData.my_user.local_user_view.counts.post_count
                    } ${pluraliseNumber(
                      myAccountData.my_user.local_user_view.counts.post_count,
                      'post',
                      'posts'
                    )}`}
                  />
                </View>
                <View row justifyContent="space-between">
                  <TextWithIcon
                    icon="Award"
                    text={`${myAccountData.my_user.local_user_view.counts.comment_score} comment score`}
                  />
                  <TextWithIcon
                    icon="Award"
                    text={`${myAccountData.my_user.local_user_view.counts.post_score} post score`}
                  />
                </View>
              </View>
            </Card>
            <CardRow
              left={<Icon name="Ban" />}
              center={<BodyText>Manage block lists</BodyText>}
              right={<Icon name="ChevronRight" />}
            />
          </>
        )}
        <SegmentedButtonRow
          scroll
          options={[
            {
              id: 'posts',
              label: 'My posts'
            },
            {
              id: 'comments',
              label: 'My comments'
            },
            {
              id: 'savedPosts',
              label: 'Saved posts'
            },
            {
              id: 'savedComments',
              label: 'Saved comments'
            }
          ]}
        />
      </ScrollView>
    </View>
  )
}
