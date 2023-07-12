import Card from '../Card'
import Button from '../Core/Button'
import { BodyText } from '../Core/Text'
import { View } from '../Core/View'
import Icon from '../Icon'

export interface ErrorBoxProps {
  error: string
  details?: string
  onRetry?: () => void
}

export default function ErrorBox({ error, details, onRetry }: ErrorBoxProps) {
  return (
    <Card
      padding="$1"
      backgroundColor="$errorBackground"
      gap="$0.5"
      flexGrow={0}
    >
      <View row gap="$0.5" centerV>
        <Icon name="AlertTriangle" color="$errorText" />
        <BodyText color="$errorText" marginLeft="$0.5">
          {error}
        </BodyText>
      </View>
      {details && <BodyText tiny>{details}</BodyText>}
      {onRetry && <Button variant="primary" onPress={onRetry} label="Retry" />}
    </Card>
  )
}
