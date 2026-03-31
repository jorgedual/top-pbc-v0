'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processing...')

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (error) {
        router.replace('/?authError=' + encodeURIComponent(errorDescription || error))
        return
      }

      const supabase = createClient()

      // Wait a moment for any URL processing
      await new Promise(resolve => setTimeout(resolve, 300))

      // Check if session was established
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        setStatus('Error: ' + sessionError.message)
        setTimeout(() => router.replace('/?authError=' + encodeURIComponent(sessionError.message)), 2000)
        return
      }

      if (sessionData.session) {
        setStatus('Success! Redirecting...')
        setTimeout(() => router.replace('/'), 500)
      } else {
        // Try getting user directly
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          setStatus('Success! Redirecting...')
          setTimeout(() => router.replace('/'), 500)
        } else {
          setStatus('No session found')
          setTimeout(() => router.replace('/?authError=No+session+found'), 2000)
        }
      }
    }

    processCallback()
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  )
}
