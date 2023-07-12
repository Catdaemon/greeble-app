namespace Lemmy.Counts {
  export interface PostCounts {
    comments: number
    downvotes: number
    score: number
    upvotes: number
  }
  export interface CommentCounts {
    comments: number
    downvotes: number
    score: number
    upvotes: number
  }
  export interface CommunityCounts {
    comments: number
    community_id: string
    hot_rank: number
    id: number
    posts: number
    published: string
    subscribers: number
    users_active_day: number
    users_active_half_year: number
    users_active_month: number
    users_active_week: number
  }
  export interface PersonCounts {
    comment_count: number
    comment_score: number
    post_count: number
    post_score: number
  }
}
