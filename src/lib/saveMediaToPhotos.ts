import { SaveFormat, manipulateAsync } from 'expo-image-manipulator'
import * as MediaLibrary from 'expo-media-library'
import getLinkInfo from './getLinkInfo'
import { LinkType } from './lemmy/linkInfoTypes'

export default async function saveMediaToPhotos(contentUrl: string) {
  const linkInfo = await getLinkInfo(contentUrl)

  if (linkInfo.type === LinkType.Video) {
    await MediaLibrary.saveToLibraryAsync(contentUrl)
  } else {
    const manipResult = await manipulateAsync(contentUrl, [], {
      compress: 1,
      format: SaveFormat.PNG
    })
    await MediaLibrary.saveToLibraryAsync(manipResult.uri)
  }
}
