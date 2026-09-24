/** Red iz tabele `posts` (recept). */
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  created_at: string;
  description: string | null;
  youtube_url: string | null;
  image_url: string | null;
  tags: string[];
}

export interface PostStats {
  total_views: number;
  total_likes: number;
}

/** Recept za kartice/liste — bez punog teksta. */
export type PostSummary = Omit<Post, "content"> & { stats: PostStats };

export type PostFull = Post & { stats: PostStats };

export interface Playlist {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
  tags: string[];
  /** ID-evi recepata, sortirani po `playlist_posts.position`. */
  post_ids: string[];
}

/** Red koji vraća RPC `trending_posts`. */
export interface TrendingPost extends Omit<Post, "content"> {
  views_period: number;
  likes_period: number;
  views_prev: number;
  total_views: number;
  total_likes: number;
  score: number;
}
