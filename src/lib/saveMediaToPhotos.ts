import { SaveFormat, manipulateAsync } from 'expo-image-manipulator'
import * as MediaLibrary from 'expo-media-library'
import getLinkInfo from './getLinkInfo'
import { LinkType } from './lemmy/linkInfoTypes'
import * as FileSystem from 'expo-file-system'

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

export async function saveRemoteMediaToPhotos(
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
