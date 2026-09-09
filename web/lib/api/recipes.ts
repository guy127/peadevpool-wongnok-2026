import { apiFetch } from "@/lib/api/client"
import type { Recipe, RecipeListResponse, RecipeWriteInput } from "@/lib/api/types"

export type RecipeListParams = {
  name?: string
  difficulty?: string
  favorite?: boolean
  sort?: "ASC" | "DESC"
  page?: number
  limit?: number
}

function buildQuery(params: RecipeListParams) {
  const search = new URLSearchParams()
  if (params.name) search.set("name", params.name)
  if (params.difficulty) search.set("difficulty", params.difficulty)
  if (params.favorite !== undefined) search.set("favorite", String(params.favorite))
  if (params.sort) search.set("sort", params.sort)
  if (params.page) search.set("page", String(params.page))
  if (params.limit) search.set("limit", String(params.limit))
  const query = search.toString()
  return query ? `?${query}` : ""
}

export function listRecipes(params: RecipeListParams = {}) {
  return apiFetch<RecipeListResponse>(`/recipes${buildQuery(params)}`)
}

export function getRecipe(id: number) {
  return apiFetch<Recipe>(`/recipes/${id}`)
}

export function createRecipe(input: RecipeWriteInput) {
  return apiFetch<{ id: number }>("/recipes", {
    method: "POST",
    body: input,
  })
}

export function updateRecipe(id: number, input: RecipeWriteInput) {
  return apiFetch<Recipe>(`/recipes/${id}`, {
    method: "PUT",
    body: input,
  })
}

export function deleteRecipe(id: number) {
  return apiFetch<void>(`/recipes/${id}`, { method: "DELETE" })
}

export function favoriteRecipe(id: number) {
  return apiFetch<void>(`/recipes/${id}/favorite`, { method: "POST" })
}

export function unfavoriteRecipe(id: number) {
  return apiFetch<void>(`/recipes/${id}/favorite`, { method: "DELETE" })
}

export function rateRecipe(id: number, rating: number) {
  return apiFetch<void>(`/recipes/${id}/rating`, {
    method: "POST",
    body: { rating },
  })
}
