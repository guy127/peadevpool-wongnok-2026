"use client"

import * as React from "react"
import { Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { LockIcon, SearchIcon } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RecipeCard, RecipeCardSkeleton } from "@/components/recipe/recipe-card"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { ApiError } from "@/lib/api/client"
import { listRecipes } from "@/lib/api/recipes"
import { DIFFICULTIES } from "@/lib/constants"
import type { Recipe } from "@/lib/api/types"

const LIMIT = 12

type Status = "loading" | "ready" | "error" | "unauthorized"

function RecipeListContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()

  const name = searchParams.get("name") ?? ""
  const difficulty = searchParams.get("difficulty") ?? "all"
  const sort = (searchParams.get("sort") as "ASC" | "DESC" | null) ?? "DESC"
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1)

  const [searchInput, setSearchInput] = React.useState(name)
  const [recipes, setRecipes] = React.useState<Recipe[] | null>(null)
  const [total, setTotal] = React.useState(0)
  const [status, setStatus] = React.useState<Status>("loading")
  const [reloadKey, setReloadKey] = React.useState(0)

  const updateParams = React.useCallback(
    (next: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(next)) {
        if (value === null || value === "") params.delete(key)
        else params.set(key, value)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== name) updateParams({ name: searchInput || null, page: null })
    }, 350)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus("loading")
      try {
        const data = await listRecipes({
          name: name || undefined,
          difficulty: difficulty === "all" ? undefined : difficulty,
          sort,
          page,
          limit: LIMIT,
        })
        if (cancelled) return
        setRecipes(data.results)
        setTotal(data.total)
        setStatus("ready")
      } catch (error) {
        if (cancelled) return
        setStatus(error instanceof ApiError && error.status === 401 ? "unauthorized" : "error")
      }
    }
    load()

    return () => {
      cancelled = true
    }
  }, [name, difficulty, sort, page, reloadKey])

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">All Recipes</h1>
        <p className="text-sm text-muted-foreground">
          {status === "ready" ? `Showing ${total} recipe${total === 1 ? "" : "s"}` : "Browse recipes shared by the Wongnok community"}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search recipes by name..."
            className="pl-8"
          />
        </div>
        <Select
          value={difficulty}
          onValueChange={(value) => updateParams({ difficulty: value === "all" ? null : String(value), page: null })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(value) => updateParams({ sort: String(value), page: null })}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Newest</SelectItem>
            <SelectItem value="ASC">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {status === "unauthorized" ? (
        <EmptyState
          icon={LockIcon}
          title="Sign in to browse recipes"
          description="Wongnok recipes are visible to signed-in members. Sign in to see what the community has shared."
          action={{ label: "Sign in", onClick: signIn }}
        />
      ) : status === "error" ? (
        <ErrorState onRetry={() => setReloadKey((k) => k + 1)} />
      ) : status === "loading" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : recipes && recipes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateParams({ page: String(page - 1) })}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateParams({ page: String(page + 1) })}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No recipes match your filters"
          description="Try a different search term or clear your filters to see everything."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearchInput("")
              router.push(pathname)
            },
          }}
        />
      )}
    </div>
  )
}

export default function RecipeListPage() {
  return (
    <Suspense fallback={null}>
      <RecipeListContent />
    </Suspense>
  )
}
