"use client"

import * as React from "react"
import { HeartIcon } from "lucide-react"
import { motion } from "motion/react"
import { toast } from "sonner"
import { cn } from "cn"

import { useAuth } from "@/components/auth/auth-provider"
import { favoriteRecipe, unfavoriteRecipe } from "@/lib/api/recipes"

type FavoriteButtonProps = {
  recipeId: number
  isFavorite: boolean
  size?: "sm" | "md"
  className?: string
}

export function FavoriteButton({
  recipeId,
  isFavorite,
  size = "md",
  className,
}: FavoriteButtonProps) {
  const { isAuthenticated, signIn } = useAuth()
  const [favorite, setFavorite] = React.useState(isFavorite)
  const [syncedIsFavorite, setSyncedIsFavorite] = React.useState(isFavorite)
  const [pending, setPending] = React.useState(false)

  // Keep local (optimistic) state in sync when the recipe's isFavorite prop
  // changes underneath us, e.g. after a fresh list refetch.
  if (isFavorite !== syncedIsFavorite) {
    setSyncedIsFavorite(isFavorite)
    setFavorite(isFavorite)
  }

  async function toggle(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated) {
      toast("Sign in to favorite recipes", {
        action: { label: "Sign in", onClick: signIn },
      })
      return
    }

    const next = !favorite
    setFavorite(next)
    setPending(true)
    try {
      await (next ? favoriteRecipe(recipeId) : unfavoriteRecipe(recipeId))
    } catch {
      setFavorite(!next)
      toast.error("Couldn't update favorite. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <motion.button
      type="button"
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorite}
      disabled={pending}
      whileTap={{ scale: 0.85 }}
      onClick={toggle}
      className={cn(
        "flex items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm ring-1 ring-border backdrop-blur-sm transition-colors hover:bg-background disabled:opacity-70",
        size === "sm" ? "size-7" : "size-9",
        className
      )}
    >
      <HeartIcon
        className={cn(
          size === "sm" ? "size-3.5" : "size-4",
          favorite ? "fill-primary text-primary" : "text-foreground"
        )}
      />
    </motion.button>
  )
}
