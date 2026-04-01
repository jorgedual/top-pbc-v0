'use client'

import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { Search, TrendingUp, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ProductCard } from '@/components/product-card'
import { FilterBar } from '@/components/filter-bar'
import { useUser } from '@/hooks/use-user'
import { createClient } from '@/lib/supabase/client'
import type { Product, Store, Category, Subcategory, Filters, ReactionType, ReactionCounts } from '@/lib/types'

const fetcher = async (url: string) => {
  const supabase = createClient()

  if (url === 'products') {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        store:stores(*),
        category:categories(*),
        subcategory:subcategories(*)
      `)
      .order('reaction_score', { ascending: false })

    if (error) throw error
    return data
  }

  if (url === 'stores') {
    const { data, error } = await supabase.from('stores').select('*').order('name')
    if (error) throw error
    return data
  }

  if (url === 'categories') {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) throw error
    return data
  }

  if (url === 'subcategories') {
    const { data, error } = await supabase.from('subcategories').select('*').order('name')
    if (error) throw error
    return data
  }

  return null
}

export function ProductList() {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [reactingId, setReactingId] = useState<string | null>(null)
  const [userReactions, setUserReactions] = useState<Map<string, ReactionType>>(new Map())
  const [reactionsCounts, setReactionsCounts] = useState<Map<string, ReactionCounts>>(new Map())
  const [filters, setFilters] = useState<Filters>({
    store: null,
    category: null,
    subcategory: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'reaction_score',
  })

  const { data: products, mutate: mutateProducts } = useSWR('products', fetcher)
  const { data: stores } = useSWR('stores', fetcher)
  const { data: categories } = useSWR('categories', fetcher)
  const { data: subcategories } = useSWR('subcategories', fetcher)

  // Load reactions from Supabase
  useEffect(() => {
    const fetchReactions = async () => {
      const supabase = createClient()

      // Fetch all reaction counts (always, regardless of auth)
      const { data: countsData } = await supabase
        .from('reactions')
        .select('product_id, reaction_type')

      if (countsData) {
        const countsMap = new Map<string, ReactionCounts>()
        countsData.forEach((r) => {
          const existing = countsMap.get(r.product_id) || {
            like_count: 0,
            love_count: 0,
            angry_count: 0,
            neutral_count: 0,
            total_reactions: 0,
          }
          existing.total_reactions++
          switch (r.reaction_type) {
            case 'like':
              existing.like_count++
              break
            case 'love':
              existing.love_count++
              break
            case 'angry':
              existing.angry_count++
              break
            case 'neutral':
              existing.neutral_count++
              break
          }
          countsMap.set(r.product_id, existing)
        })
        setReactionsCounts(countsMap)
      }

      // Fetch user's reactions only if logged in
      if (user) {
        const { data: userReactionsData } = await supabase
          .from('reactions')
          .select('product_id, reaction_type')
          .eq('user_id', user.id)

        if (userReactionsData) {
          const reactionsMap = new Map<string, ReactionType>()
          userReactionsData.forEach((r) => {
            reactionsMap.set(r.product_id, r.reaction_type as ReactionType)
          })
          setUserReactions(reactionsMap)
        }
      } else {
        // Clear user reactions when logged out
        setUserReactions(new Map())
      }
    }

    fetchReactions()
  }, [user])

  const handleReact = useCallback(async (productId: string, reactionType: ReactionType) => {
    if (reactingId) return
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    setReactingId(productId)
    const supabase = createClient()
    const existingReaction = userReactions.get(productId)

    try {
      if (existingReaction === reactionType) {
        // Remove reaction (clicking same reaction again)
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', user.id)

        if (error) throw error

        const newUserReactions = new Map(userReactions)
        newUserReactions.delete(productId)
        setUserReactions(newUserReactions)
      } else {
        // Add or update reaction
        const { error } = await supabase
          .from('reactions')
          .upsert({
            product_id: productId,
            user_id: user.id,
            reaction_type: reactionType,
          }, {
            onConflict: 'product_id,user_id'
          })

        if (error) throw error

        const newUserReactions = new Map(userReactions)
        newUserReactions.set(productId, reactionType)
        setUserReactions(newUserReactions)
      }

      // Update local counts
      const newCounts = new Map(reactionsCounts)
      const counts = newCounts.get(productId) || {
        like_count: 0,
        love_count: 0,
        angry_count: 0,
        neutral_count: 0,
        total_reactions: 0,
      }

      // Remove old reaction from counts
      if (existingReaction) {
        counts.total_reactions--
        switch (existingReaction) {
          case 'like':
            counts.like_count--
            break
          case 'love':
            counts.love_count--
            break
          case 'angry':
            counts.angry_count--
            break
          case 'neutral':
            counts.neutral_count--
            break
        }
      }

      // Add new reaction to counts (if not removing)
      if (existingReaction !== reactionType) {
        counts.total_reactions++
        switch (reactionType) {
          case 'like':
            counts.like_count++
            break
          case 'love':
            counts.love_count++
            break
          case 'angry':
            counts.angry_count++
            break
          case 'neutral':
            counts.neutral_count++
            break
        }
      }

      newCounts.set(productId, counts)
      setReactionsCounts(newCounts)

      mutateProducts()
    } catch (error) {
      console.error('Error handling reaction:', error)
    } finally {
      setReactingId(null)
    }
  }, [reactingId, userReactions, reactionsCounts, user, mutateProducts])

  // Filter and sort products
  const filteredProducts = products
    ?.filter((product) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !product.name.toLowerCase().includes(query) &&
          !(product.description?.toLowerCase().includes(query))
        ) {
          return false
        }
      }
      if (filters.store && product.store_id !== filters.store) return false
      if (filters.category && product.category_id !== filters.category) return false
      if (filters.subcategory && product.subcategory_id !== filters.subcategory) return false
      if (filters.minPrice && product.price < filters.minPrice) return false
      if (filters.maxPrice && product.price > filters.maxPrice) return false
      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'reaction_score':
          return b.reaction_score - a.reaction_score
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        default:
          return 0
      }
    })

  const totalScore = products?.reduce((acc, p) => acc + (p.reaction_score || 0), 0) || 0
  const totalReactions = Array.from(reactionsCounts.values()).reduce((acc, r) => acc + r.total_reactions, 0)

  return (
    <div className="space-y-6">
      <main className="max-w-5xl mx-auto">
        {/* Filters Bar */}
        <FilterBar
          stores={stores || []}
          categories={categories || []}
          subcategories={subcategories || []}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Search Bar */}
        <div className="relative mt-4 mb-6">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Package className="size-4" />
            <span>{filteredProducts?.length || 0} productos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="size-4" />
            <span>{totalScore} puntos de reacción</span>
          </div>
          {totalReactions > 0 && (
            <div className="flex items-center gap-1.5">
              <span>❤️</span>
              <span>{totalReactions} reacciones totales</span>
            </div>
          )}
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {!filteredProducts ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl border border-border bg-card animate-pulse"
              />
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="size-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">
                No se encontraron productos
              </h3>
              <p className="text-muted-foreground mt-1">
                Intenta ajustar los filtros o buscar algo diferente
              </p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                rank={index + 1}
                onReact={handleReact}
                isReacting={reactingId === product.id}
                reactions={reactionsCounts.get(product.id)}
                userReaction={userReactions.get(product.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
