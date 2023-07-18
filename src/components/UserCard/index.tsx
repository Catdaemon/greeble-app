import { formatRelative } from 'date-fns'
import { router } from 'expo-router'
import useActionSheet from '../../hooks/useActionSheet'
import { useLemmyMutation } from '../../lib/lemmy/rqHooks'
import queryKeys from '../../lib/lemmy/rqKeys'
import { useComposeMessageStore } from '../../stores/composeMessageStore'
import Avatar from '../Avatar'
import Card from '../Card'
import FullScreenLoader from '../Core/Loader/FullScreenLoader'
import MoreButton from '../Core/MoreButton'
import { BodyText, HeadingText } from '../Core/Text'
import { View } from '../Core/View'
import Icon from '../Icon'

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
      title: 'Message user',
      action: () => {
        useComposeMessageStore.setState({
          message: '',
          toUser: personData.person,
          replyingTo: null
        })
        router.push('/message/compose')
      }
    },
    {
      title: 'Block user',
      action: async () => {
        await blockUser({
          person_id: personData.person.id,
          block: true
        })
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
