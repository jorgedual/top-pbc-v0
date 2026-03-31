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
  comments_count?: number
  created_at: string
  store: Store
  category: Category
  subcategory: Subcategory | null
}

export interface Filters {
  store: string | null
  category: string | null
  subcategory: string | null
  minPrice: number | null
  maxPrice: number | null
  sortBy: 'votes' | 'price_asc' | 'price_desc' | 'newest'
}
