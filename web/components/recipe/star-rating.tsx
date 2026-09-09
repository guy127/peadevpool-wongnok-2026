"use client"

import * as React from "react"
import { motion } from "motion/react"
import { StarIcon } from "lucide-react"
import { cn } from "cn"

const SIZE_CLASS = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-6",
} as const

type StarRatingProps = {
  value: number
  totalStars?: number
  size?: keyof typeof SIZE_CLASS
  className?: string
}

/** Read-only star display, e.g. an average rating on a recipe card. */
export function StarRating({
  value,
  totalStars = 5,
  size = "md",
  className,
}: StarRatingProps) {
  const rounded = Math.round(value)
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: totalStars }, (_, i) => i + 1).map((star) => (
        <StarIcon
          key={star}
          className={cn(
            SIZE_CLASS[size],
            star <= rounded
              ? "fill-primary text-primary"
              : "fill-transparent text-muted-foreground"
          )}
        />
      ))}
    </div>
  )
}

type InteractiveStarRatingProps = {
  value: number
  totalStars?: number
  size?: keyof typeof SIZE_CLASS
  disabled?: boolean
  onChange: (value: number) => void
  className?: string
}

/** Clickable star input for a user to submit their own rating. */
export function InteractiveStarRating({
  value,
  totalStars = 5,
  size = "lg",
  disabled = false,
  onChange,
  className,
}: InteractiveStarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
  const displayValue = hoverValue ?? value

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: totalStars }, (_, i) => i + 1).map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={disabled}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          whileHover={disabled ? undefined : { scale: 1.15 }}
          whileTap={disabled ? undefined : { scale: 0.95 }}
          className={cn(disabled && "cursor-not-allowed opacity-60")}
          onMouseEnter={() => setHoverValue(star)}
          onClick={() => onChange(star)}
        >
          <StarIcon
            className={cn(
              SIZE_CLASS[size],
              star <= displayValue
                ? "fill-primary text-primary"
                : "fill-transparent text-muted-foreground"
            )}
          />
        </motion.button>
      ))}
    </div>
  )
}
