export type ReactionType = 'like' | 'love' | 'angry' | 'neutral'

export interface Reaction {
  id: string
  product_id: string
  user_id: string
  reaction_type: ReactionType
  created_at: string
}

export interface ReactionCounts {
  like_count: number
  love_count: number
  angry_count: number
  neutral_count: number
  total_reactions: number
}

export interface Store {
  id: string
  name: string
  created_at: string
}

export interface Category {
  id: string
  name: string
}

export interface Subcategory {
  id: string
  name: string
  category_id: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  store_id: string
  category_id: string
  subcategory_id: string | null
  votes: number
  reaction_score: number
  comments_count?: number
  created_at: string
  store: Store
  category: Category
  subcategory: Subcategory | null
  reactions?: ReactionCounts
  user_reaction?: ReactionType
}

export interface Filters {
  store: string | null
  category: string | null
  subcategory: string | null
  minPrice: number | null
  maxPrice: number | null
  sortBy: 'reaction_score' | 'price_asc' | 'price_desc' | 'newest'
}
