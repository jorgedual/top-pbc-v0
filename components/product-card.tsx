'use client'

import { ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onVote: (productId: string) => void
  isVoting?: boolean
  hasVoted?: boolean
}

// Colores predefinidos para tiendas
const storeColors: Record<string, string> = {
  'D1': '#E31837',
  'Ara': '#FF6B00',
  'Dollarcity': '#00A651',
  'Justo & Bueno': '#FFD100',
  'Tiendas 3B': '#0066B3',
}

export function ProductCard({ product, onVote, isVoting, hasVoted }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const storeColor = storeColors[product.store?.name] || '#6B7280'

  return (
    <div className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md">
      {/* Vote Button */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant={hasVoted ? 'default' : 'outline'}
          size="sm"
          className="flex h-auto min-w-14 flex-col gap-0.5 px-3 py-2"
          onClick={() => onVote(product.id)}
          disabled={isVoting}
        >
          <ChevronUp className="size-4" />
          <span className="text-sm font-semibold">{product.votes}</span>
        </Button>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-emerald-600">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
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
      </div>
    </div>
  )
}
