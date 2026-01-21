import { ShoppingBag, TrendingUp } from 'lucide-react'
import { ProductList } from '@/components/product-list'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-emerald-500 text-white">
                <ShoppingBag className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AhorraVotos</h1>
                <p className="text-xs text-muted-foreground">
                  Descubre los mejores productos de bajo costo
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="size-4 text-emerald-500" />
              <span>Votado por la comunidad</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50/50 to-background dark:from-emerald-950/20 py-12 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Vota por los mejores productos de{' '}
            <span className="text-emerald-600">tiendas de bajo costo</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Descubre, comparte y vota por los productos mas utiles de D1, Ara, Dollarcity 
            y otras tiendas de descuento. La comunidad decide que vale la pena comprar.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <ProductList />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Hecho con amor para ahorradores inteligentes</p>
        </div>
      </footer>
    </div>
  )
}
