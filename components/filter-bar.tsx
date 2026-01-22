'use client'

import { useState } from 'react'
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

interface FilterBarProps {
  stores: Store[]
  categories: Category[]
  subcategories: Subcategory[]
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function FilterBar({
  stores,
  categories,
  subcategories,
  filters,
  onFiltersChange,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)

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
      sortBy: 'votes',
    })
  }

  const hasActiveFilters =
    filters.store ||
    filters.category ||
    filters.subcategory ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.sortBy !== 'votes'

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Header - Always Visible */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="size-5 text-primary" />
          <h2 className="font-semibold text-foreground">Filtros</h2>
          {hasActiveFilters && (
            <span className="text-xs text-muted-foreground">
              ({hasActiveFilters ? 'Activos' : 'Todos'})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4 mr-1" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <span className="hidden sm:inline">
                  {isOpen ? 'Ocultar' : 'Mostrar'}
                </span>
                <ChevronDown
                  className={`size-4 transition-transform sm:ml-1 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </div>

      {/* Collapsible Filters */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Store Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tienda</Label>
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
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Categoría</Label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('category', value === 'all' ? null : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subcategoría</Label>
              <Select
                value={filters.subcategory || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('subcategory', value === 'all' ? null : value)
                }
                disabled={!filters.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las subcategorías</SelectItem>
                  {filteredSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Precio</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'minPrice',
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="h-9"
                />
                <span className="text-muted-foreground text-sm">-</span>
                <Input
                  type="number"
                  placeholder="Max"
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

            {/* Sort By */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-4">
              <Label className="text-sm font-medium">Ordenar por</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'votes', label: 'Más votados' },
                  { value: 'newest', label: 'Más recientes' },
                  { value: 'price_asc', label: 'Precio: menor a mayor' },
                  { value: 'price_desc', label: 'Precio: mayor a menor' },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.sortBy === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      handleFilterChange('sortBy', option.value as Filters['sortBy'])
                    }
                    className="h-8"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
