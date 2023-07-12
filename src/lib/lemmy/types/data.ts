namespace Lemmy.Data {
  export interface PostData {
    community: Lemmy.Objects.Community
    counts: Lemmy.Counts.PostCounts
    creator_banned_from_community: boolean
    creator_blocked: boolean
    creator: Lemmy.Objects.Person
    my_vote?: number
    post: Lemmy.Objects.Post
    read: boolean
    saved: boolean
    subscribed: Lemmy.Enums.SubscribedType
    unread_comments: number
  }
  export interface CommentData {
    comment: Lemmy.Objects.Comment
    community: Lemmy.Objects.Community
    counts: Lemmy.Counts.CommentCounts
    creator_banned_from_community: boolean
    creator_blocked: boolean
    creator: Lemmy.Objects.Person
    my_vote?: number
    post: Lemmy.Objects.Post
    saved: boolean
    subscribed: Lemmy.Enums.SubscribedType
  }
  export interface CommunityData {
    blocked: boolean
    community: Lemmy.Objects.Community
    counts: Lemmy.Counts.CommunityCounts
    subscribed: Lemmy.Enums.SubscribedType
  }
  export interface CommunityModerator {
    community: Lemmy.Objects.Community
    moderator: Lemmy.Objects.Person
  }
  export interface PersonData {
    counts: Lemmy.Counts.PersonCounts
    person: Lemmy.Objects.Person
  }
  export interface SiteData {
    id: string
    site_id: string
    site_setup: boolean
    enable_downvotes: boolean
    enable_nsfw: boolean
    community_creation_admin_only: boolean
    require_email_verification: boolean
    application_question?: string
    private_instance: boolean
    default_theme: string
    default_post_listing_type: Lemmy.Enums.ListingType
    legal_information?: string
    hide_modlog_mod_names: boolean
    application_email_admins: boolean
    slur_filter_regex?: string
    actor_name_max_length: number
    federation_enabled: boolean
    captcha_enabled: boolean
    captcha_difficulty: string
    published: string
    updated?: string
    registration_mode: Lemmy.Enums.RegistrationMode
    reports_email_admins: boolean
  }
}
