namespace Lemmy {
  export interface CommentResponse {
    comment_view: Lemmy.Data.CommentData
    recepient_ids: string[]
  }
  export interface PostResponse {
    post_view: Lemmy.Data.CommentData
  }
}
namespace Lemmy.Requests.Login {
  export interface Request {
    username_or_email: string
    password: string
  }
  export interface Response {
    jwt?: string
  }
}
namespace Lemmy.Requests.GetPosts {
  export interface Request extends Auth {
    community_id?: string
    community_name?: string
    limit?: number
    page: number
    saved_only?: boolean
    sort: Lemmy.Enums.SortType
    type_: Lemmy.Enums.ListingType
  }
  export interface SavedPostsRequest extends Auth {
    limit?: number
    page: number
    saved_only: true
    sort: Lemmy.Enums.SortType
    type_: Lemmy.Enums.SortType
  }
  export interface Response {
    posts: Lemmy.Data.PostData[]
  }
}
namespace Lemmy.Requests.GetSinglePost {
  export interface Request extends Auth {
    id?: string
    comment_id?: string
  }
  export interface Response {
    post_view: Lemmy.Data.PostData
    community_view: Lemmy.Data.CommunityData
    cross_posts: Lemmy.Data.PostData[]
  }
}
namespace Lemmy.Requests.GetComments {
  export interface Request extends Auth {
    limit?: number
    max_depth?: number
    page?: number
    parent_id?: string
    post_id?: string
    sort?: Lemmy.Enums.CommentSortType
    type_?: Lemmy.Enums.ListingType
  }
  export interface SavedCommentsRequest extends Auth {
    limit?: number
    page: number
    saved_only: true
    sort: Lemmy.Enums.SortType
    type_: Lemmy.Enums.ListingType
  }
  export interface Response {
    comments: Lemmy.Data.CommentData[]
  }
}
namespace Lemmy.Requests.GetCommunity {
  export interface Request extends Auth {
    id?: string
    name?: string
  }
  export interface Response {
    community_view: Lemmy.Data.CommunityData
    moderators: Lemmy.Data.CommunityModerator[]
    site?: Lemmy.Data.SiteData
    // discussion_languages: Array<LanguageId>;
  }
}
namespace Lemmy.Requests.GetSite {
  export interface Request extends Auth {}
  export interface Response {
    admins: Lemmy.Data.PersonData[]
    all_languages: Lemmy.Objects.Language[]
    custom_emojis: any[]
    discussion_languages: string[]
    my_user?: Lemmy.Objects.LocalUserInfo
    taglines: Lemmy.Objects.TagLine[]
    version: string
    site_view: {
      counts: {
        comments: number
        communities: number
        posts: number
        users_active_day: number
        users_active_half_year: number
        users_active_month: number
        users_active_week: number
        users: number
      }
      local_site_rate_limit: any
      local_site: Lemmy.Data.SiteData
      site: Lemmy.Objects.Site
    }
  }
}
namespace Lemmy.Requests.GetUser {
  export interface Request extends Auth {
    person_id?: string
    username?: string
    sort?: Lemmy.Enums.SortType
    page?: number
    limit?: number
  }
  export interface Response {
    person_view: Lemmy.Data.PersonData
    comments: Lemmy.Data.CommentData[]
    posts: Lemmy.Data.PostData[]
    // moderates: Array<CommunityModeratorView>;
  }
}
namespace Lemmy.Requests.LikeComment {
  export interface Request extends Auth {
    comment_id: string
    score: number
  }
  export interface Response extends CommentResponse {}
}
namespace Lemmy.Requests.LikePost {
  export interface Request extends Auth {
    post_id: string
    score: number
  }
  export interface Response extends PostResponse {}
}
namespace Lemmy.Requests.SaveComment {
  export interface Request extends Auth {
    comment_id: string
    save: boolean
  }
  export interface Response extends CommentResponse {}
}
namespace Lemmy.Requests.SavePost {
  export interface Request extends Auth {
    post_id: string
    save: boolean
  }
  export interface Response extends PostResponse {}
}
namespace Lemmy.Requests.Search {
  export interface Request extends Auth {
    q: string
    community_id?: string
    creator_id?: string
    type_?: Lemmy.Enums.SearchType
    sort?: Lemmy.Enums.SortType
    listing_type?: Lemmy.Enums.ListingType
    page: number
    limit?: number
    auth?: string
  }
  export interface Response {
    type_: Lemmy.Enums.SearchType
    comments: Lemmy.Data.CommentData[]
    posts: Lemmy.Data.PostData[]
    communities: Lemmy.Data.CommunityData[]
    users: Lemmy.Data.PersonData[]
  }
}
namespace Lemmy.Requests.SubscribeToCommunity {
  export interface Request extends Auth {
    community_id: string
    follow: boolean
  }
  export interface Response extends GetCommunity.Response {}
}
namespace Lemmy.Requests.BlockCommunity {
  export interface Request extends Auth {
    community_id: string
    block: boolean
  }
  export interface Response extends GetCommunity.Response {}
}
namespace Lemmy.Requests.BlockPerson {
  export interface Request extends Auth {
    person_id: string
    block: boolean
  }
  export interface Response extends GetUser.Response {}
}
namespace Lemmy.Requests.GetCommunities {
  export interface Request extends Auth {
    type_?: Lemmy.Enums.ListingType
    sort?: Lemmy.Enums.SortType
    show_nsfw?: boolean
    limit?: number
  }
  export interface Response {
    communities: Lemmy.Data.CommunityData[]
  }
}
