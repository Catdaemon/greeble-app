import { ContentStyle, FlashList } from '@shopify/flash-list'
import { FunctionComponent, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import { useTheme } from 'tamagui'
import { View } from '../Core/View'

interface InfiniteListProps<TData> {
  data: TData[]
  isLoading: boolean
  isRefetching: boolean
  fetchNextPage?: () => void
  refetch?: () => void
  headerComponent?: FunctionComponent<any>
  footerComponent?: FunctionComponent<any>
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  estimatedItemSize: number
  renderItem: (data: TData, index: number) => any
  keyExtractor: (item: any) => string
  contentContainerStyle?: ContentStyle
}

export type InfiniteListImplementation<TData> = Omit<
  InfiniteListProps<TData>,
  'estimatedItemSize' | 'keyExtractor' | 'renderItem'
>

export default function InfiniteList<TData>(props: InfiniteListProps<TData>) {
  const theme = useTheme()
  const indicatorColor = theme.primaryColor.get()
  const originalScrollPosition = useRef(0)
  const listRef = useRef<FlashList<TData>>(null)

  return (
    <View flex>
      <FlashList
        ref={listRef}
        scrollEventThrottle={1}
        onScroll={props.onScroll}
        estimatedItemSize={132}
        data={props.data}
        contentContainerStyle={props.contentContainerStyle}
        renderItem={({ item, index }) => props.renderItem(item, index)}
        keyExtractor={props.keyExtractor}
        onEndReached={props.fetchNextPage}
        onEndReachedThreshold={2}
        onRefresh={props.refetch}
        refreshing={props.isRefetching}
        refreshControl={
          <RefreshControl
            colors={[indicatorColor]}
            tintColor={indicatorColor}
            enabled={!props.isLoading}
            refreshing={props.isRefetching}
            onRefresh={props.refetch}
          />
        }
        ListHeaderComponent={props.headerComponent}
        ListFooterComponent={props.footerComponent}
      />
    </View>
  )
}
