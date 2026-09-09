"use client"

import * as React from "react"
import Link from "next/link"
import { ChefHatIcon, PlusIcon } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/auth/require-auth"
import { Button } from "@/components/ui/button"
import { RecipeCard, RecipeCardSkeleton } from "@/components/recipe/recipe-card"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { listRecipes } from "@/lib/api/recipes"
import type { Recipe } from "@/lib/api/types"

function MyRecipesContent() {
  const { user } = useAuth()
  const [recipes, setRecipes] = React.useState<Recipe[] | null>(null)
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading")
  const [reloadKey, setReloadKey] = React.useState(0)

  React.useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      setStatus("loading")
      try {
        const data = await listRecipes({ sort: "DESC", limit: 100 })
        if (cancelled) return
        setRecipes(data.results.filter((recipe) => recipe.creator.id === user!.id))
        setStatus("ready")
      } catch {
        if (!cancelled) setStatus("error")
      }
    }
    load()

    return () => {
      cancelled = true
    }
  }, [user, reloadKey])

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Recipes</h1>
          <p className="text-sm text-muted-foreground">
            Recipes you&apos;ve shared with the Wongnok community.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/recipes/new" />}>
          <PlusIcon data-icon="inline-start" />
          Create recipe
        </Button>
      </div>

      {status === "error" ? (
        <ErrorState onRetry={() => setReloadKey((k) => k + 1)} />
      ) : status === "loading" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ChefHatIcon}
          title="You haven't shared any recipes yet"
          description="Publish your first recipe and let the Wongnok community follow along."
          action={{ label: "Create your first recipe", href: "/recipes/new" }}
        />
      )}
    </div>
  )
}

export default function MyRecipesPage() {
  return (
    <RequireAuth>
      <MyRecipesContent />
    </RequireAuth>
  )
}
