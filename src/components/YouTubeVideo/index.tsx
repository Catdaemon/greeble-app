import { useEffect, useMemo, useRef, useState } from 'react'
import { AppState, Platform } from 'react-native'
import WebView from 'react-native-webview'
import { View } from '../Core/View'
import { getYouTubeVideoId } from '../../lib/getLinkInfo'
import useAppState from '../../hooks/useAppState'

interface YoutubeVideoProps {
  videoUrl: string
  play?: boolean // Play/stop the content
  autoPlay?: boolean // Play the content on mount
}

// Renders a youtube embed inside a WebView, and controls its playback
export function YouTubeVideo({ videoUrl, play, autoPlay }: YoutubeVideoProps) {
  const videoRef = useRef<WebView>(null)
  const [loaded, setLoaded] = useState(false)

  // Extract the video ID from a youtube url
  const videoId = useMemo(() => getYouTubeVideoId(videoUrl), [videoUrl])

  // Script to inject into the rendered page
  const playerScript = `
  <script>
    let playing = ${autoPlay ? 'true' : 'false'}
    function play () {
        playing = true
        if (player) {
            player.playVideo()
        }
    }
    function pause () {
        playing = false
        if (player) {
            player.stopVideo()
        }
    }

    let player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('yt-${videoId}', {
            videoId: '${videoId}',
            width: 1000,
            height: 1000,
            playerVars: {
              modestbranding: true,
              fs: true,
              playsinline: 1,
              origin: window.location.origin
            },
            events: {
                'onReady': onPlayerReady,
            }
        })
    }

    function onPlayerReady(event) {
        if (playing) {
            event.target.playVideo()
        }
    }
  </script>
  `

  // HTML to render
  const embed = `
  <!DOCTYPE html>
  <html>
    <head>
    <meta name="viewport" content="width=device-width" />
        ${playerScript}
        <script src='https://www.youtube.com/iframe_api'></script>
        <style>
            body {
                background-color: black;
            }
            iframe {
                width: calc(100vw + 16px) !important;
                height: calc(100vh + 16px) !important;
                background-color:black;
                margin: -16px;
                padding:0;
            }
        </style>
    </head>
    <body>
        <div id='yt-${videoId}'></div>
    </body>
  </html>`

  // Injects javascript into the web view to call the play or pause function
  const sendPlayCommand = () => {
    const command = play ? 'play()' : 'pause()'
    if (Platform.OS !== 'web') {
      videoRef.current?.injectJavaScript(command)
    }
  }

  useEffect(() => {
    sendPlayCommand()
  }, [play])

  // Debugging js
  const javascript = `
    const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
    console = {
        log: (log) => consoleLog('log', log),
        debug: (log) => consoleLog('debug', log),
        info: (log) => consoleLog('info', log),
        warn: (log) => consoleLog('warn', log),
        error: (log) => consoleLog('error', log),
        };
`

  // Called when a message is posted from inside the WebView
  const onMessage = (payload: any) => {
    let dataPayload: any
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data)
    } catch (e) {}

    if (dataPayload) {
      if (dataPayload.type === 'Console') {
        console.info(`[Console] ${JSON.stringify(dataPayload.data)}`)
      } else {
        console.log(dataPayload)
      }
    }
  }

  // We need to ensure youtube videos do not play in the background
  // to comply with the App Store guidelines
  const appState = useAppState()

  const memoizedWebView = useMemo(
    () => (
      <WebView
        ref={videoRef}
        source={{ html: embed }}
        style={{
          flex: 1,
          backgroundColor: 'black'
        }}
        onLoadStart={() => (!loaded ? setLoaded(false) : null)}
        onLoadEnd={() => setLoaded(true)}
        onLoad={() => setLoaded(true)}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={
          Platform.OS !== 'android' || Platform.Version >= 17
            ? false
            : undefined
        }
        // Video won't play properly unless YouTube thinks this is a web browser
        userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
        // This property does not exist on the web version of the WebView component
        injectedJavaScript={Platform.OS === 'web' ? undefined : javascript}
        onMessage={onMessage}
        originWhitelist={['*']}
        bounces={false}
        scrollEnabled={false}
        pointerEvents="auto"
      />
    ),
    [embed, setLoaded, onMessage, javascript]
  )

  return (
    <View style={{ flex: 1, opacity: loaded ? 1 : 0 }}>
      {appState === 'active' && memoizedWebView}
    </View>
  )
}
