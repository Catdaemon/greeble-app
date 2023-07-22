import * as FileSystem from 'expo-file-system'
import * as Crypto from 'expo-crypto'
import { useEffect, useState } from 'react'

const CACHE_DIR = `${FileSystem.cacheDirectory}greeble-tmp/`

async function getUrlFilename(url: string) {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    url
  )
  return hash
}

export async function getUrlDestination(url: string) {
  const filename = await getUrlFilename(url)
  return `${CACHE_DIR}${filename}`
}

export async function clearFileDownloadCache() {
  await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true })
}

export async function getFileDownloadCacheSizeMB() {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR)
  if (!dirInfo.exists) {
    return 0
  }
  const dirSize = dirInfo.size
  // Return in megabytes
  return Math.round(dirSize / 1024 / 1024)
}

export default function useFileDownload(
  url: string,
  headers?: Record<string, string>
) {
  const [isDownloading, setIsDownloading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [filePath, setFilePath] = useState<string>(
    url?.startsWith('file://') ? url : null
  )

  useEffect(() => {
    const downloadFile = async () => {
      if (!url) {
        return
      }
      if (url.startsWith('file://')) {
        setFilePath(url)
        setIsDownloading(false)
        setDownloadProgress(100)
        return
      }

      const destinationUri = await getUrlDestination(url)
      const dirExists = await FileSystem.getInfoAsync(CACHE_DIR)
      const fileExists = await FileSystem.getInfoAsync(destinationUri)

      if (!dirExists.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIR, {
          intermediates: true
        })
      }

      if (fileExists.exists) {
        setIsDownloading(false)
        setDownloadProgress(100)
        setFilePath(destinationUri)
        return
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        destinationUri,
        {
          headers
        },
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite
          setDownloadProgress(progress)
        }
      )
      try {
        setIsDownloading(true)
        await downloadResumable.downloadAsync()
        setFilePath(destinationUri)
        setIsDownloading(false)
      } catch (e) {
        setIsError(true)
        setIsDownloading(false)
        console.log(e)
      }
    }
    downloadFile()
  }, [url])

  return { filePath, isDownloading, isError, downloadProgress }
}
