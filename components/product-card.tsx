'use client'

import { Package, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ReactionsBar } from '@/components/reactions-bar'
import { CommentsSection } from '@/components/comments-section'
import { cn } from '@/lib/utils'
import type { Product, ReactionType, ReactionCounts } from '@/lib/types'

interface ProductCardProps {
  product: Product
  rank?: number
  onReact: (productId: string, reactionType: ReactionType) => void
  isReacting?: boolean
  reactions?: ReactionCounts
  userReaction?: ReactionType
}

// Colores predefinidos para tiendas
const storeColors: Record<string, string> = {
  'D1': '#E31837',
  'Ara': '#FF6B00',
  'Dollarcity': '#00A651',
  'Justo & Bueno': '#FFD100',
  'Tiendas 3B': '#0066B3',
}

const defaultReactions: ReactionCounts = {
  like_count: 0,
  love_count: 0,
  angry_count: 0,
  neutral_count: 0,
  total_reactions: 0,
}

export function ProductCard({ product, rank, onReact, isReacting, reactions = defaultReactions, userReaction }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const storeColor = storeColors[product.store?.name] || '#6B7280'

  const handleReact = (reactionType: ReactionType) => {
    onReact(product.id, reactionType)
  }

  return (
    <div className="group relative flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md">
      {/* Rank Badge - Top 3 get special styling */}
      {rank && (
        <div className={cn(
          'absolute -top-2 -left-2 sm:left-2 sm:top-2 z-10',
          'flex items-center justify-center',
          'w-7 h-7 sm:w-8 sm:h-8',
          'rounded-full',
          'text-sm sm:text-base font-bold',
          'shadow-md',
          rank === 1 && 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950 ring-2 ring-yellow-300',
          rank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 ring-2 ring-gray-200',
          rank === 3 && 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50 ring-2 ring-amber-400',
          rank > 3 && 'bg-muted text-muted-foreground'
        )}>
          {rank <= 3 ? (
            <span>{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</span>
          ) : (
            <span>#{rank}</span>
          )}
        </div>
      )}

      {/* Product Image - Hidden on mobile */}
      <div className="shrink-0 hidden sm:block">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="size-20 rounded-lg object-cover bg-muted"
          />
        ) : (
          <div className="size-20 rounded-lg bg-muted flex items-center justify-center">
            <Package className="size-8 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-2 sm:gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-emerald-600">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {product.comments_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="size-3" />
              <span>{product.comments_count}</span>
            </div>
          )}
          {product.store && (
            <Badge
              variant="secondary"
              className="text-xs"
              style={{
                backgroundColor: `${storeColor}20`,
                color: storeColor,
                borderColor: storeColor
              }}
            >
              {product.store.name}
            </Badge>
          )}
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category.name}
            </Badge>
          )}
          {product.subcategory && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {product.subcategory.name}
            </Badge>
          )}
        </div>

        {/* Reactions - Mobile only, below tags */}
        <div className="flex sm:hidden">
          <ReactionsBar
            reactions={reactions}
            userReaction={userReaction}
            onReact={handleReact}
            disabled={isReacting}
            compact
          />
        </div>

        <CommentsSection productId={product.id} commentsCount={product.comments_count || 0} />
      </div>

      {/* Reactions Bar - Desktop only */}
      <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
        <ReactionsBar
          reactions={reactions}
          userReaction={userReaction}
          onReact={handleReact}
          disabled={isReacting}
        />
      </div>
    </div>
  )
}
