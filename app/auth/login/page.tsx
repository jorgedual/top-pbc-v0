'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  useEffect(() => {
    const signIn = async () => {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        // Handle error silently or redirect to home
      } else if (data.url) {
        window.location.href = data.url
      }
    }

    signIn()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to Google...</p>
      </div>
    </div>
  )
}
