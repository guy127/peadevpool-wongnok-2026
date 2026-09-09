import Link from "next/link"
import { ImageOffIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DifficultyBadge } from "@/components/recipe/difficulty-badge"
import { FavoriteButton } from "@/components/recipe/favorite-button"
import { StarRating } from "@/components/recipe/star-rating"
import { durationName } from "@/lib/constants"
import type { Recipe } from "@/lib/api/types"

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="relative overflow-hidden p-0 transition-shadow hover:shadow-md">
      <Link
        href={`/recipes/${recipe.id}`}
        className="absolute inset-0 z-0"
        aria-label={recipe.name}
      />
      <FavoriteButton
        recipeId={recipe.id}
        isFavorite={recipe.isFavorite}
        size="sm"
        className="absolute top-2 right-2 z-10"
      />
      <div className="relative aspect-4/3 w-full bg-muted">
        {recipe.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-submitted URLs, not local/optimizable assets
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOffIcon className="size-8" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-1.5">
          <DifficultyBadge difficultyId={recipe.difficulty.id} />
          <span className="text-xs text-muted-foreground">
            {durationName(recipe.duration.id)}
          </span>
        </div>
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
          {recipe.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <StarRating value={recipe.rating.average} size="sm" />
          <span>
            {recipe.rating.average.toFixed(1)} ({recipe.rating.total})
          </span>
        </div>
      </div>
    </Card>
  )
}

export function RecipeCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </Card>
  )
}
