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

export async function getRemoteMediaBase64(
  contentUrl: string,
  progressCallback: (progress: number) => void
) {
  const linkInfo = await getLinkInfo(contentUrl)

  if (linkInfo.type === LinkType.Video) {
    const callback = (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite
      progressCallback(progress)
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      contentUrl,
      FileSystem.cacheDirectory + 'greeble-temp.mp4',
      {},
      callback
    )

    await downloadResumable.downloadAsync()
    const b64 = FileSystem.readAsStringAsync(downloadResumable.fileUri, {
      encoding: FileSystem.EncodingType.Base64
    })
    await FileSystem.deleteAsync(downloadResumable.fileUri)
    return b64
  } else {
    const download = await FileSystem.downloadAsync(
      contentUrl,
      FileSystem.cacheDirectory + 'greeble-temp.jpg'
    )
    const manipResult = await manipulateAsync(download.uri, [], {
      compress: 1,
      format: SaveFormat.PNG,
      base64: true
    })
    FileSystem.deleteAsync(download.uri)
    FileSystem.deleteAsync(manipResult.uri)
    return manipResult.base64
  }
}
