'use client'

import { useState } from 'react'
import { MessageSquare, Send, User } from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
}

interface CommentsSectionProps {
  productId: string
  commentsCount: number
}

export function CommentsSection({ productId, commentsCount }: CommentsSectionProps) {
  const { user } = useUser()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const fetchComments = async () => {
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setComments(data as Comment[])
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return

    setSubmitting(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('comments')
      .insert({
        product_id: productId,
        user_id: user!.id,
        content: newComment.trim(),
      })
      .select()
      .single()

    if (!error && data) {
      setNewComment('')
      fetchComments()
    }

    setSubmitting(false)
  }

  const toggleComments = () => {
    if (!showComments && comments.length === 0) {
      fetchComments()
    }
    setShowComments(!showComments)
  }

  return (
    <div className="mt-4">
      <button
        onClick={toggleComments}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <MessageSquare className="size-4" />
        <span>{commentsCount} comentario{commentsCount !== 1 ? 's' : ''}</span>
      </button>

      {showComments && (
        <div className="mt-4 space-y-4">
          {user && (
            <div className="flex gap-2">
              <Textarea
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 min-h-[80px] resize-none"
              />
              <Button
                onClick={handleSubmit}
                disabled={!newComment.trim() || submitting}
                size="icon"
                className="self-end"
              >
                <Send className="size-4" />
              </Button>
            </div>
          )}

          {!user && (
            <p className="text-sm text-muted-foreground text-center py-4">
              <a href="/auth/login" className="text-primary hover:underline">
                Inicia sesión
              </a>{' '}
              para dejar un comentario
            </p>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {user?.id === comment.user_id ? 'Tú' : 'Usuario'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground break-words">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay comentarios aún. ¡Sé el primero!
            </p>
          )}
        </div>
      )}
    </div>
  )
}
