'use client'

import { cn } from '@/lib/utils'
import type { ReactionType, ReactionCounts } from '@/lib/types'

interface ReactionsBarProps {
  reactions: ReactionCounts
  userReaction?: ReactionType
  onReact: (type: ReactionType) => void
  disabled?: boolean
  compact?: boolean
}

const REACTIONS: { type: ReactionType; emoji: string; label: string; weight: number }[] = [
  { type: 'love', emoji: '❤️', label: 'Me encanta', weight: 3 },
  { type: 'like', emoji: '👍', label: 'Me gusta', weight: 2 },
  { type: 'neutral', emoji: '😐', label: 'Indiferente', weight: 1 },
  { type: 'angry', emoji: '😡', label: 'Me enoja', weight: 0 },
]

export function ReactionsBar({ reactions, userReaction, onReact, disabled, compact }: ReactionsBarProps) {
  const totalScore = (reactions.like_count * 2) + (reactions.love_count * 3) + (reactions.neutral_count * 1)

  const getCount = (type: ReactionType) => {
    switch (type) {
      case 'like': return reactions.like_count
      case 'love': return reactions.love_count
      case 'angry': return reactions.angry_count
      case 'neutral': return reactions.neutral_count
    }
  }

  return (
    <div className={cn('flex items-center gap-1', compact ? 'gap-0.5' : 'gap-1')}>
      {REACTIONS.map((reaction) => {
        const count = getCount(reaction.type)
        const isActive = userReaction === reaction.type

        return (
          <button
            key={reaction.type}
            onClick={() => onReact(reaction.type)}
            disabled={disabled}
            title={reaction.label}
            className={cn(
              'group relative flex items-center justify-center',
              'rounded-lg transition-all duration-200',
              'bg-muted/30 hover:bg-muted/60',
              'border border-border/50 hover:border-primary/50',
              'hover:scale-105 active:scale-95',
              'shadow-sm hover:shadow-md',
              'cursor-pointer',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-muted/30',
              compact
                ? 'size-8 text-lg'
                : 'size-10 text-xl',
              isActive && 'ring-2 ring-primary ring-offset-2 bg-primary/10 border-primary/50'
            )}
          >
            <span className={cn(
              'transition-transform',
              isActive && 'scale-125'
            )}>
              {reaction.emoji}
            </span>

            {!compact && count > 0 && (
              <span className={cn(
                'absolute -bottom-1 -right-1',
                'flex items-center justify-center',
                'min-w-[16px] h-4 px-1',
                'text-[10px] font-bold leading-none',
                'rounded-full',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/80 group-hover:text-primary-foreground',
                'transition-colors'
              )}>
                {count}
              </span>
            )}

            {compact && count > 0 && (
              <span className="absolute -top-1 -right-1 text-[9px] font-bold text-muted-foreground">
                {count}
              </span>
            )}
          </button>
        )
      })}

      {!compact && (
        <div className="ml-2 flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-muted/50">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
            Puntos
          </span>
          <span className="text-sm font-bold text-foreground">
            {totalScore}
          </span>
        </div>
      )}
    </div>
  )
}
