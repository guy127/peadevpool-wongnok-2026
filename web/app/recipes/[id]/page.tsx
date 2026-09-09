"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { ImageOffIcon, PencilIcon } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DifficultyBadge } from "@/components/recipe/difficulty-badge"
import { FavoriteButton } from "@/components/recipe/favorite-button"
import {
  InteractiveStarRating,
  StarRating,
} from "@/components/recipe/star-rating"
import { ErrorState } from "@/components/shared/error-state"
import { ApiError } from "@/lib/api/client"
import { getRecipe, rateRecipe } from "@/lib/api/recipes"
import { durationName } from "@/lib/constants"
import type { Recipe } from "@/lib/api/types"

export default function RecipeDetailsPage() {
  const params = useParams<{ id: string }>()
  const recipeId = Number(params.id)
  const { user, isAuthenticated, signIn } = useAuth()

  const [recipe, setRecipe] = React.useState<Recipe | null>(null)
  const [notFound, setNotFound] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [reloadKey, setReloadKey] = React.useState(0)
  const [myRating, setMyRating] = React.useState(0)
  const [hasRated, setHasRated] = React.useState(false)
  const [ratingPending, setRatingPending] = React.useState(false)

  React.useEffect(() => {
    if (!Number.isFinite(recipeId)) return
    let cancelled = false

    async function load() {
      setRecipe(null)
      setNotFound(false)
      setError(false)
      try {
        const data = await getRecipe(recipeId)
        if (!cancelled) setRecipe(data)
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 404) setNotFound(true)
        else setError(true)
      }
    }
    load()

    return () => {
      cancelled = true
    }
  }, [recipeId, reloadKey])

  async function submitRating(value: number) {
    if (!recipe || hasRated || ratingPending) return
    setMyRating(value)
    setRatingPending(true)
    try {
      await rateRecipe(recipe.id, value)
      setHasRated(true)
      setRecipe((prev) =>
        prev
          ? { ...prev, rating: { ...prev.rating, total: prev.rating.total + 1 } }
          : prev
      )
      toast.success("Thanks for rating!")
    } catch {
      setMyRating(0)
      toast.error("Couldn't submit your rating. Please try again.")
    } finally {
      setRatingPending(false)
    }
  }

  if (!Number.isFinite(recipeId)) {
    return (
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <ErrorState
          title="Invalid recipe"
          description="This recipe link looks incorrect."
        />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-xl font-semibold text-foreground">
          Recipe not found
        </h1>
        <p className="text-sm text-muted-foreground">
          This recipe doesn&apos;t exist or was removed.
        </p>
        <Button nativeButton={false} render={<Link href="/recipes" />}>
          Back to recipes
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <ErrorState onRetry={() => setReloadKey((k) => k + 1)} />
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="mt-6 h-8 w-2/3" />
        <Skeleton className="mt-3 h-4 w-1/3" />
        <Skeleton className="mt-8 h-24 w-full" />
      </div>
    )
  }

  const isOwner = user?.id === recipe.creator.id

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
        {recipe.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-submitted URL
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOffIcon className="size-10" />
          </div>
        )}
        <FavoriteButton
          recipeId={recipe.id}
          isFavorite={recipe.isFavorite}
          className="absolute top-3 right-3"
        />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficultyId={recipe.difficulty.id} />
          <span className="text-sm text-muted-foreground">
            {durationName(recipe.duration.id)}
          </span>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              nativeButton={false}
              render={<Link href={`/recipes/${recipe.id}/edit`} />}
            >
              <PencilIcon data-icon="inline-start" />
              Edit recipe
            </Button>
          )}
        </div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          {recipe.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>by {recipe.creator.name}</span>
          <span className="flex items-center gap-1.5">
            <StarRating value={recipe.rating.average} size="sm" />
            {recipe.rating.average.toFixed(1)} ({recipe.rating.total} rating
            {recipe.rating.total === 1 ? "" : "s"})
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-foreground/90">
          {recipe.description}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="mb-3 text-base font-semibold text-foreground">
            Ingredients
          </h2>
          {recipe.ingredients.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No ingredients listed.
            </p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm text-foreground">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {ingredient.description}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="md:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-foreground">
            Instructions
          </h2>
          {recipe.instructions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No instructions listed.
            </p>
          ) : (
            <ol className="flex flex-col gap-4 text-sm text-foreground">
              {recipe.instructions.map((instruction, index) => (
                <li key={instruction.id} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <p className="pt-0.5 leading-relaxed">
                    {instruction.description}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/30 px-6 py-8 text-center">
        <h2 className="text-base font-semibold text-foreground">
          Rate this recipe
        </h2>
        {isAuthenticated ? (
          <>
            <InteractiveStarRating
              value={myRating}
              disabled={hasRated || ratingPending}
              onChange={submitRating}
            />
            {hasRated && (
              <p className="text-sm text-muted-foreground">
                Thanks for rating!
              </p>
            )}
          </>
        ) : (
          <>
            <InteractiveStarRating value={0} disabled onChange={() => {}} />
            <Button size="sm" variant="outline" onClick={signIn}>
              Sign in to rate
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
