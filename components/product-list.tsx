'use client'

import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { Search, TrendingUp, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ProductCard } from '@/components/product-card'
import { FilterBar } from '@/components/filter-bar'
import { useUser } from '@/hooks/use-user'
import { createClient } from '@/lib/supabase/client'
import type { Product, Store, Category, Subcategory, Filters } from '@/lib/types'

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
      .order('votes', { ascending: false })

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
  const [votedProducts, setVotedProducts] = useState<Set<string>>(new Set())
  const [votingId, setVotingId] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    store: null,
    category: null,
    subcategory: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'votes',
  })

  const { data: products, mutate: mutateProducts } = useSWR('products', fetcher)
  const { data: stores } = useSWR('stores', fetcher)
  const { data: categories } = useSWR('categories', fetcher)
  const { data: subcategories } = useSWR('subcategories', fetcher)

  // Load voted products from Supabase
  useEffect(() => {
    const fetchVotes = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('votes')
        .select('product_id')
        .eq('user_id', user?.id || '')

      if (data) {
        const votedIds = data.map((v) => v.product_id)
        setVotedProducts(new Set(votedIds))
      }
    }

    if (user) {
      fetchVotes()
    }
  }, [user])

  const handleVote = useCallback(async (productId: string) => {
    if (votingId) return

    setVotingId(productId)
    const supabase = createClient()
    const hasVoted = votedProducts.has(productId)

    try {
      if (hasVoted) {
        // Remove vote
        if (user) {
          const { error } = await supabase
            .from('votes')
            .delete()
            .eq('product_id', productId)
            .eq('user_id', user.id)

          if (error) {
            throw error
          }

          const newVoted = new Set(votedProducts)
          newVoted.delete(productId)
          setVotedProducts(newVoted)
          mutateProducts()
        }
      } else {
        // Add vote
        if (user) {
          const { error } = await supabase
            .from('votes')
            .insert({
              product_id: productId,
              user_id: user.id,
            })

          if (error) {
            if (error.message.includes('Ya has votado')) {
              // Already voted, update local state
              const newVoted = new Set(votedProducts)
              newVoted.add(productId)
              setVotedProducts(newVoted)
            }
          } else {
            const newVoted = new Set(votedProducts)
            newVoted.add(productId)
            setVotedProducts(newVoted)
            mutateProducts()
          }
        } else {
          // Redirect to login
          window.location.href = '/auth/login'
          setVotingId(null)
          return
        }
      }
    } finally {
      setVotingId(null)
    }
  }, [votingId, votedProducts, products, mutateProducts, user])

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
        case 'votes':
          return b.votes - a.votes
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
            <span>
              {products?.reduce((acc, p) => acc + p.votes, 0) || 0} votos totales
            </span>
          </div>
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
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onVote={handleVote}
                isVoting={votingId === product.id}
                hasVoted={votedProducts.has(product.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
