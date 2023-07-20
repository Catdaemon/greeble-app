import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator'
import getLinkInfo from './getLinkInfo'
import { LinkType } from './lemmy/linkInfoTypes'

export default async function saveMediaToPhotos(
  contentUrl: string,
  progressCallback: (progress: number) => void
) {
  const linkInfo = getLinkInfo(contentUrl)

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
    await MediaLibrary.saveToLibraryAsync(downloadResumable.fileUri)
    await FileSystem.deleteAsync(downloadResumable.fileUri)
  } else {
    const download = await FileSystem.downloadAsync(
      contentUrl,
      FileSystem.cacheDirectory + 'greeble-temp.jpg'
    )
    const manipResult = await manipulateAsync(download.uri, [], {
      compress: 1,
      format: SaveFormat.PNG
    })
    await MediaLibrary.saveToLibraryAsync(manipResult.uri)
    await FileSystem.deleteAsync(download.uri)
    await FileSystem.deleteAsync(manipResult.uri)
  }
}
