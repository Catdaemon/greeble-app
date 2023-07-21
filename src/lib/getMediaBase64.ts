import * as FileSystem from 'expo-file-system'
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator'
import getLinkInfo from './getLinkInfo'
import { LinkType } from './lemmy/linkInfoTypes'

export default async function getMediaBase64(contentUrl: string) {
  const linkInfo = await getLinkInfo(contentUrl)

  if (linkInfo.type === LinkType.Video) {
    const b64 = FileSystem.readAsStringAsync(contentUrl, {
      encoding: FileSystem.EncodingType.Base64
    })
    return b64
  } else {
    const manipResult = await manipulateAsync(contentUrl, [], {
      compress: 1,
      format: SaveFormat.PNG,
      base64: true
    })
    return manipResult.base64
  }
}
