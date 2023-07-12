import { formatRelative } from 'date-fns'
import Card from '../Card'
import { BodyText, HeadingText } from '../Core/Text'
import { View } from '../Core/View'
import Icon from '../Icon'
import Image from '../Core/Image'
import Avatar from '../Avatar'
import { Pressable } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import useActionSheet from '../../hooks/useActionSheet'
import { useLemmyMutation } from '../../lib/lemmy/rqHooks'
import queryKeys from '../../lib/lemmy/rqKeys'
import { router } from 'expo-router'
import FullScreenLoader from '../Core/Loader/FullScreenLoader'
import MoreButton from '../Core/MoreButton'

export interface UserProps {
  personData: Lemmy.Data.PersonData
}

export default function UserCard({ personData }: UserProps) {
  const { mutateAsync: blockUser, isLoading: blockLoading } = useLemmyMutation(
    'blockUser',
    [queryKeys.USER, personData.person.id]
  )

  const showActionSheet = useActionSheet('User actions', [
    {
      title: 'Block user',
      action: async () => {
        console.log('block user')
        await blockUser({
          person_id: personData.person.id,
          block: true
        })
        console.log('block user done')
        router.back()
      }
    }
  ])

  if (blockLoading) {
    return <FullScreenLoader />
  }

  return (
    <Card>
      <View row gap="$0.5">
        <Avatar
          size={72}
          placeholderIcon="User"
          src={personData.person.avatar}
        />
        <View flex>
          <View flex row spread>
            <View row flex spread>
              <HeadingText>
                {personData.person.display_name ?? personData.person.name}{' '}
                {personData.person.bot_account && (
                  <Icon name="Bot" size="$1" color="red" />
                )}
              </HeadingText>
              <MoreButton onPress={showActionSheet} />
            </View>
          </View>
          <BodyText>{personData.person.actor_id}</BodyText>
          <BodyText>
            Joined{' '}
            {formatRelative(new Date(personData.person.published), new Date())}{' '}
            ({new Date(personData.person.published).toLocaleDateString()})
          </BodyText>
        </View>
      </View>
      <View marginTop="$0.5">
        <BodyText>
          {personData.counts.post_count} post
          {personData.counts.post_count != 1 ? 's' : null} (
          {personData.counts.post_score} score)
        </BodyText>
        <BodyText>
          {personData.counts.comment_count} comment
          {personData.counts.comment_count != 1 ? 's' : null} (
          {personData.counts.comment_score} score)
        </BodyText>
      </View>
    </Card>
  )
}
