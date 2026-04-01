'use client'

import { LogOut, User } from 'lucide-react'
import { useAuthContext } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AuthButton() {
  const { user, loading, mutate } = useAuthContext()
  const router = useRouter()
  const [signingIn, setSigningIn] = useState(false)

  const handleSignIn = async () => {
    setSigningIn(true)
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setSigningIn(false)
    } else if (data.url) {
      window.location.href = data.url
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    mutate()
    router.refresh()
  }

  if (loading) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
    )
  }

  if (!user) {
    return (
      <Button onClick={handleSignIn} disabled={signingIn} variant="default">
        <User className="mr-2 size-4" />
        {signingIn ? 'Redirigiendo...' : 'Iniciar sesión'}
      </Button>
    )
  }

  const userInitials = user.email?.charAt(0).toUpperCase() ?? 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="size-9">
            <AvatarImage src={user.user_metadata.avatar_url} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.user_metadata.full_name || 'Usuario'}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button type="button" className="w-full cursor-pointer" onClick={handleSignOut}>
            <LogOut className="mr-2 size-4" />
            Cerrar sesión
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
