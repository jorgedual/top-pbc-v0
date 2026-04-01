'use client'

import { useState, useEffect } from 'react'
import { X, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { Store, Category, Subcategory, Filters } from '@/lib/types'

interface FilterSidebarProps {
  stores: Store[]
  categories: Category[]
  subcategories: Subcategory[]
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function FilterSidebar({
  stores,
  categories,
  subcategories,
  filters,
  onFiltersChange,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    store: true,
    category: true,
    price: true,
    sort: true,
  })

  const filteredSubcategories = filters.category
    ? subcategories.filter((s) => s.category_id === filters.category)
    : subcategories

  const handleFilterChange = (key: keyof Filters, value: string | number | null) => {
    const newFilters = { ...filters, [key]: value }
    
    // Reset subcategory when category changes
    if (key === 'category') {
      newFilters.subcategory = null
    }
    
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    onFiltersChange({
      store: null,
      category: null,
      subcategory: null,
      minPrice: null,
      maxPrice: null,
      sortBy: 'reaction_score',
    })
  }

  const hasActiveFilters =
    filters.store ||
    filters.category ||
    filters.subcategory ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.sortBy !== 'reaction_score'

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="sticky top-4 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-primary" />
            <h2 className="font-semibold text-foreground">Filtros</h2>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Store Filter */}
          <Collapsible
            open={openSections.store}
            onOpenChange={(open) =>
              setOpenSections((s) => ({ ...s, store: open }))
            }
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Tienda
              <ChevronDown
                className={`size-4 transition-transform ${
                  openSections.store ? 'rotate-180' : ''
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <Select
                value={filters.store || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('store', value === 'all' ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las tiendas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las tiendas</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: store.color }}
                        />
                        {store.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>

          {/* Category Filter */}
          <Collapsible
            open={openSections.category}
            onOpenChange={(open) =>
              setOpenSections((s) => ({ ...s, category: open }))
            }
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Categoria
              <ChevronDown
                className={`size-4 transition-transform ${
                  openSections.category ? 'rotate-180' : ''
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('category', value === 'all' ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filters.category && filteredSubcategories.length > 0 && (
                <Select
                  value={filters.subcategory || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange('subcategory', value === 'all' ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las subcategorias</SelectItem>
                    {filteredSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Price Filter */}
          <Collapsible
            open={openSections.price}
            onOpenChange={(open) =>
              setOpenSections((s) => ({ ...s, price: open }))
            }
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Precio
              <ChevronDown
                className={`size-4 transition-transform ${
                  openSections.price ? 'rotate-180' : ''
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Min</Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={filters.minPrice || ''}
                    onChange={(e) =>
                      handleFilterChange(
                        'minPrice',
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="h-9"
                  />
                </div>
                <span className="text-muted-foreground mt-5">-</span>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Max</Label>
                  <Input
                    type="number"
                    placeholder="$999.999"
                    value={filters.maxPrice || ''}
                    onChange={(e) =>
                      handleFilterChange(
                        'maxPrice',
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="h-9"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Sort */}
          <Collapsible
            open={openSections.sort}
            onOpenChange={(open) =>
              setOpenSections((s) => ({ ...s, sort: open }))
            }
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Ordenar por
              <ChevronDown
                className={`size-4 transition-transform ${
                  openSections.sort ? 'rotate-180' : ''
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  handleFilterChange('sortBy', value as Filters['sortBy'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reaction_score">Mas populares ❤️</SelectItem>
                  <SelectItem value="newest">Mas recientes</SelectItem>
                  <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </aside>
  )
}
