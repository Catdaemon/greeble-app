namespace Lemmy.Objects {
  export interface Post {
    ap_id: string
    body?: string
    community_id: string
    creator_id: string
    deleted: boolean
    embed_description?: string
    embed_title?: string
    embed_video_url?: string
    featured_community: boolean
    featured_local: boolean
    id: string
    language_id: string
    local: boolean
    locked: boolean
    name: string
    nsfw: boolean
    published: string
    removed: boolean
    thumbnail_url?: string
    updated?: string
    url?: string
  }
  export interface Comment {
    id: string
    creator_id: string
    post_id: string
    content: string
    removed: boolean
    published: string
    updated?: string
    deleted: boolean
    ap_id: string
    local: boolean
    path: string
    distinguished: boolean
    language_id: string
  }
  export interface Person {
    actor_id: string
    admin: boolean
    avatar?: string
    ban_expires?: string
    banned: boolean
    banner?: string
    bio?: string
    bot_account: boolean
    deleted: boolean
    display_name?: string
    id: string
    instance_id: string
    local: boolean
    matrix_user_id?: string
    name: string
    published: string
    updated?: string
  }
  export interface Site {
    actor_id: string
    banner?: string
    description?: string
    icon?: string
    id: string
    inbox_url: string
    instance_id: string
    last_refreshed_at: string
    name: string
    private_key?: string
    public_key: string
    published: string
    sidebar?: string
    updated?: string
  }
  export interface Community {
    actor_id: string
    banner?: string
    deleted: boolean
    description?: string
    hidden: boolean
    icon?: string
    id: string
    instance_id: string
    local: boolean
    name: string
    nsfw: boolean
    posting_restricted_to_mods: boolean
    published: string
    removed: boolean
    title: string
    updated?: string
  }
  export interface Language {
    code: string
    id: string
    name: string
  }
  export interface TagLine {
    content: string
    id: number
    local_site_id: string
    published: string
    updated?: string
  }
  export interface LocalUserInfo {
    local_user_view: {
      local_user: any
      person: Person
      counts: Lemmy.Counts.PersonCounts
    }
    // follows: Array<CommunityFollowerView>
    // moderates: Array<CommunityModeratorView>
    community_blocks: {
      community: Community
    }[]
    person_blocks: {
      person: Person
    }[]
    discussion_languages: string[]
  }
  export interface PrivateMessage {
    ap_id: string
    content: string
    creator_id: string
    deleted: boolean
    id: string
    local: boolean
    published: string
    read: boolean
    recipient_id: string
    updated?: string
  }
}
