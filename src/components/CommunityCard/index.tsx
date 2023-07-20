import { Dimensions } from 'react-native'
import { useTheme } from 'tamagui'
import Card from '../Card'
import Button from '../Core/Button'
import { BodyText, HeadingText } from '../Core/Text'
import { View } from '../Core/View'
import Image from '../Core/Image'

export interface CommunityCardProps {
  communityData: Lemmy.Data.CommunityData
}

export default function CommunityCard({ communityData }: CommunityCardProps) {
  const theme = useTheme()

  const domain = new URL(communityData.community.actor_id).hostname
  const hasImage = !!(
    communityData.community.banner ?? communityData.community.icon
  )

  return (
    <Card>
      {hasImage && (
        <Image
          style={{ height: 150 }}
          contentFit="cover"
          contentPosition="top center"
          source={{
            uri: communityData.community.banner ?? communityData.community.icon
          }}
        />
      )}
      <View marginTop="$1">
        <View row spread>
          <View flex>
            <HeadingText flex numberOfLines={1}>
              {communityData.community.title}
            </HeadingText>
            <BodyText flex>
              {communityData.community.name}@{domain}
            </BodyText>
          </View>
          <Button
            size="medium"
            variant="primary"
            label="Subscribe"
            marginLeft="$1"
          ></Button>
        </View>
        <View>
          <View row spread>
            <BodyText marginTop="$0.5">
              {communityData.counts.posts} posts
            </BodyText>
            <BodyText marginTop="$0.5">
              {communityData.counts.subscribers} subscribers
            </BodyText>
          </View>
        </View>
      </View>
    </Card>
  )
}
