import {
  UseMutationOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery
} from '@tanstack/react-query'
import { useAccountStore } from '../../stores/accountStore'
import {
  LemmyFetcherName,
  LemmyFetcherReturnType,
  LemmyPayloadArg,
  lemmyFetch,
  lemmyFetcherFunc
} from './fetchers'
import queryClient from './rqClient'
import queryKeys from './rqKeys'

function getQueryKey(additionalKeys: any[] = []) {
  const accountId = useAccountStore.getState().activeAccount
  return [accountId, ...additionalKeys.map((x) => String(x))]
}

export function useLemmyQuery<FnName extends LemmyFetcherName>(
  fetcher: FnName,
  queryKeys: any[],
  payload: LemmyPayloadArg<FnName>,
  options?: UseQueryOptions<
    unknown,
    unknown,
    Awaited<LemmyFetcherReturnType<FnName>>
  >
) {
  return useQuery<unknown, unknown, Awaited<LemmyFetcherReturnType<FnName>>>({
    queryKey: getQueryKey(queryKeys),
    queryFn: () => lemmyFetch(fetcher, payload),
    ...options
  })
}

export function useLemmyInfiniteQuery<FnName extends LemmyFetcherName>(
  fetcherName: FnName,
  queryKeys: any[],
  payload: Omit<LemmyPayloadArg<FnName>, 'page'>,
  disable?: boolean
) {
  const [accounts] = useAccountStore((state) => [state.accounts])
  return useInfiniteQuery<
    unknown,
    unknown,
    Awaited<LemmyFetcherReturnType<FnName>>
  >({
    queryKey: getQueryKey(queryKeys),
    queryFn: ({ pageParam = 1 }) =>
      lemmyFetch(fetcherName, { ...payload, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      return (pages?.length ?? 0) + 1
    },
    enabled: accounts?.length > 0 && !disable
  })
}

export function resetInfiniteQueryCache<FnName extends LemmyFetcherName>(
  queryKeys: any[]
) {
  queryClient.setQueryData(getQueryKey(queryKeys), (data: any) => ({
    pages: data?.pages.slice(0, 1) ?? [],
    pageParams: data?.pageParams?.slice(0, 1) ?? []
  }))
}

export function invalidateQueries(queryKeys: any[]) {
  queryClient.invalidateQueries(getQueryKey(queryKeys))
}

export function useLemmyMutation<FnName extends LemmyFetcherName>(
  fetcher: FnName,
  queryKeys: any[],
  options?: UseMutationOptions<unknown, unknown, LemmyPayloadArg<FnName>>,
  successCallback?: () => void
) {
  return useMutation({
    mutationKey: [fetcher],
    mutationFn: async (payload: LemmyPayloadArg<FnName>) => {
      return lemmyFetch<FnName>(fetcher, payload)
    },
    onSuccess: () => {
      successCallback?.()

      if (queryKeys.length === 0) {
        return
      }
      queryClient.invalidateQueries(getQueryKey(queryKeys))
    },
    ...options
  })
}

export function useLemmyPostMutation(postId: string) {
  const { mutateAsync: likePost } = useLemmyMutation(
    'voteOnPost',
    [queryKeys.POST, postId],
    {}
  )
  const { mutateAsync: savePost } = useLemmyMutation(
    'savePost',
    [queryKeys.POST, postId],
    {}
  )

  return {
    likePost: () => likePost({ post_id: postId, score: 1 }),
    removeLike: () => likePost({ post_id: postId, score: 0 }),
    dislikePost: () => likePost({ post_id: postId, score: -1 }),
    savePost: () => savePost({ post_id: postId, save: true }),
    unsavePost: () => savePost({ post_id: postId, save: false })
  }
}

export function useLemmyCommentMutation(
  commentId: string,
  callback: () => void
) {
  const { mutateAsync: likePost, isLoading: likeLoading } = useLemmyMutation(
    'voteOnComment',
    [queryKeys.POSTCOMMENTS, commentId],
    {},
    callback
  )
  const { mutateAsync: savePost, isLoading: saveLoading } = useLemmyMutation(
    'saveComment',
    [queryKeys.POSTCOMMENTS, commentId],
    {},
    callback
  )

  return {
    likeComment: () => likePost({ comment_id: commentId, score: 1 }),
    removeLike: () => likePost({ comment_id: commentId, score: 0 }),
    dislikeComment: () => likePost({ comment_id: commentId, score: -1 }),
    saveComment: () => savePost({ comment_id: commentId, save: true }),
    unsaveComment: () => savePost({ comment_id: commentId, save: false }),
    isLoading: likeLoading || saveLoading
  }
}

export interface LoginRequest {
  username: string
  password: string
  serverURL: string
}

// Special case for login as it doesn't use the normal fetcher
export const useLogin = () => {
  return useMutation([queryKeys.LOGIN], (loginData: LoginRequest) =>
    lemmyFetcherFunc<Lemmy.Requests.Login.Response>({
      method: 'POST',
      endpoint: '/user/login',
      noAuth: true,
      serverUrl: loginData.serverURL,
      payload: {
        username_or_email: loginData.username,
        password: loginData.password
      } as Lemmy.Requests.Login.Request
    })
  )
}
