"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/auth/require-auth"
import { Skeleton } from "@/components/ui/skeleton"
import { RecipeForm } from "@/components/recipe/recipe-form"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { ApiError } from "@/lib/api/client"
import { getRecipe } from "@/lib/api/recipes"
import type { Recipe } from "@/lib/api/types"
import { LockIcon } from "lucide-react"

function EditRecipeContent() {
  const params = useParams<{ id: string }>()
  const recipeId = Number(params.id)
  const { user } = useAuth()

  const [recipe, setRecipe] = React.useState<Recipe | null>(null)
  const [status, setStatus] = React.useState<"loading" | "ready" | "not-found" | "forbidden" | "error">(
    "loading"
  )
  const [reloadKey, setReloadKey] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      if (!Number.isFinite(recipeId)) {
        setStatus("not-found")
        return
      }
      setStatus("loading")
      try {
        const data = await getRecipe(recipeId)
        if (cancelled) return
        if (data.creator.id !== user?.id) {
          setStatus("forbidden")
          return
        }
        setRecipe(data)
        setStatus("ready")
      } catch (err) {
        if (cancelled) return
        setStatus(err instanceof ApiError && err.status === 404 ? "not-found" : "error")
      }
    }
    load()

    return () => {
      cancelled = true
    }
  }, [recipeId, user?.id, reloadKey])

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="mt-6 h-64 w-full" />
      </div>
    )
  }

  if (status === "not-found") {
    return (
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <EmptyState title="Recipe not found" description="This recipe doesn't exist or was removed." />
      </div>
    )
  }

  if (status === "forbidden") {
    return (
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <EmptyState
          icon={LockIcon}
          title="You can't edit this recipe"
          description="Only the creator of a recipe can edit or delete it."
        />
      </div>
    )
  }

  if (status === "error" || !recipe) {
    return (
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <ErrorState onRetry={() => setReloadKey((k) => k + 1)} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Edit recipe</h1>
        <p className="text-sm text-muted-foreground">
          Update the details of &quot;{recipe.name}&quot;.
        </p>
      </div>
      <RecipeForm mode="edit" recipe={recipe} />
    </div>
  )
}

export default function EditRecipePage() {
  return (
    <RequireAuth>
      <EditRecipeContent />
    </RequireAuth>
  )
}
