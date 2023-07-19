import { useAccountStore } from '../../stores/accountStore'

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface FetcherArgs {
  method: RequestMethod
  endpoint: string
  payload: any
  noAuth?: boolean
  serverUrl?: string
}

export async function lemmyFetcherFunc<T>({
  method,
  endpoint,
  payload,
  noAuth,
  serverUrl
}: FetcherArgs) {
  const token = noAuth
    ? undefined
    : useAccountStore.getState().getActiveAccount()?.token
  const serverBaseUrl =
    serverUrl ?? useAccountStore.getState().getActiveAccount()?.serverURL

  const payloadWithAuth =
    noAuth || !token
      ? payload
      : {
          ...payload,
          auth: token
        }

  // Remove undefineds from the payload
  Object.keys(payloadWithAuth).forEach((key) =>
    payloadWithAuth[key] === undefined ? delete payloadWithAuth[key] : {}
  )

  let input: RequestInfo = `${serverBaseUrl}/api/v3${endpoint}`
  const config: RequestInit = {
    method
  }

  // GET requests should be sent as query params
  if (method === 'GET') {
    const asParams = new URLSearchParams(payloadWithAuth).toString()
    input = `${input}?${asParams}`
  } else {
    // Other requests should be sent as JSON
    config.headers = {
      'Content-Type': 'application/json'
    }
    config.body = JSON.stringify(payloadWithAuth)
  }

  // console.log('fetching', input, method, endpoint, payloadWithAuth)

  try {
    const response = await (Promise.race([
      fetch(input, config),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 30000)
      )
    ]) as Promise<Response>)

    // Throw if the response is not ok
    if (!response.ok) {
      throw new Error(response.status.toString())
    }

    // Return the JSON response
    const asJson = await response.json()
    return asJson as T
  } catch (e) {
    console.log('error fetching', input, method, endpoint, e, e.message)
    throw e
  }
}

const fetchers = {
  getSite: (payload: Lemmy.Requests.GetSite.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.GetSite.Response>({
      method: 'GET',
      endpoint: '/site',
      payload
    }),
  getCommunity: (payload: Lemmy.Requests.GetCommunity.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.GetCommunity.Response>({
      method: 'GET',
      endpoint: '/community',
      payload
    }),
  getUser: (payload: Lemmy.Requests.GetUser.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.GetUser.Response>({
      method: 'GET',
      endpoint: '/user',
      payload
    }),
  getPosts: (payload: Lemmy.Requests.GetPosts.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.GetPosts.Response>({
      method: 'GET',
      endpoint: '/post/list',
      payload
    }),
  getSinglePost: (payload: Lemmy.Requests.GetSinglePost.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.GetSinglePost.Response>({
      method: 'GET',
      endpoint: '/post',
      payload
    }),
  getComments: (payload: Lemmy.Requests.GetComments.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.GetComments.Response>({
      method: 'GET',
      endpoint: '/comment/list',
      payload
    }),
  saveComment: (payload: Lemmy.Requests.SaveComment.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.SaveComment.Response>({
      method: 'PUT',
      endpoint: '/comment/save',
      payload
    }),
  savePost: (payload: Lemmy.Requests.SavePost.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.SavePost.Response>({
      method: 'PUT',
      endpoint: '/post/save',
      payload
    }),
  voteOnPost: (payload: Lemmy.Requests.LikePost.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.LikePost.Response>({
      method: 'POST',
      endpoint: '/post/like',
      payload
    }),
  voteOnComment: (payload: Lemmy.Requests.LikeComment.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.LikeComment.Response>({
      method: 'POST',
      endpoint: '/comment/like',
      payload
    }),
  search: (payload: Lemmy.Requests.Search.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.Search.Response>({
      method: 'GET',
      endpoint: '/search',
      payload
    }),
  subscribeToCommunity: (
    payload: Lemmy.Requests.SubscribeToCommunity.Request
  ) =>
    lemmyFetcherFunc<Lemmy.Requests.SubscribeToCommunity.Response>({
      method: 'POST',
      endpoint: '/community/follow',
      payload
    }),
  getCommunities: (payload: Lemmy.Requests.GetCommunities.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.GetCommunities.Response>({
      method: 'GET',
      endpoint: '/community/list',
      payload
    }),
  blockUser: (payload: Lemmy.Requests.BlockPerson.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.BlockPerson.Response>({
      method: 'POST',
      endpoint: '/user/block',
      payload
    }),
  blockCommunity: (payload: Lemmy.Requests.BlockCommunity.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.BlockCommunity.Response>({
      method: 'POST',
      endpoint: '/community/block',
      payload
    }),
  getPrivateMessages: (payload: Lemmy.Requests.GetPrivateMessages.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.GetPrivateMessages.Response>({
      method: 'GET',
      endpoint: '/private_message/list',
      payload
    }),
  sendPrivateMessage: (payload: Lemmy.Requests.SendPrivateMessage.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.SendPrivateMessage.Response>({
      method: 'POST',
      endpoint: '/private_message',
      payload
    }),
  deletePrivateMessage: (
    payload: Lemmy.Requests.DeletePrivateMessage.Request
  ) =>
    lemmyFetcherFunc<Lemmy.Requests.DeletePrivateMessage.Response>({
      method: 'POST',
      endpoint: '/private_message/delete',
      payload
    }),
  markPostRead: (payload: Lemmy.Requests.MarkPostRead.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.MarkPostRead.Response>({
      method: 'POST',
      endpoint: '/post/mark_as_read',
      payload
    }),
  addComment: (payload: Lemmy.Requests.AddComment.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.AddComment.Response>({
      method: 'POST',
      endpoint: '/comment',
      payload
    }),
  editComment: (payload: Lemmy.Requests.EditComment.Request) =>
    lemmyFetcherFunc<Lemmy.Requests.EditComment.Response>({
      method: 'PUT',
      endpoint: '/comment',
      payload
    })
}

type LemmyFetchers = typeof fetchers
export type LemmyFetcherName = keyof LemmyFetchers
export type LemmyPayloadArg<T extends LemmyFetcherName> = Parameters<
  LemmyFetchers[T]
>[0]
export type LemmyFetcherReturnType<T extends LemmyFetcherName> = ReturnType<
  LemmyFetchers[T]
>

export function lemmyFetch<FnName extends LemmyFetcherName>(
  method: FnName,
  payload: LemmyPayloadArg<FnName>
) {
  const functionToCall = fetchers[method] as (
    payload: LemmyPayloadArg<FnName>
  ) => LemmyFetcherReturnType<FnName>
  // TODO: "as any" is a hack, seems to work ok though
  return functionToCall(payload)
}

export type LemmyFetchFunctionSignature<FnName extends LemmyFetcherName> = (
  functionName: FnName,
  arg: LemmyPayloadArg<FnName>
) => LemmyFetcherReturnType<FnName>
