import { RequireAuth } from "@/components/auth/require-auth"
import { RecipeForm } from "@/components/recipe/recipe-form"

export default function NewRecipePage() {
  return (
    <RequireAuth>
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Create a recipe
          </h1>
          <p className="text-sm text-muted-foreground">
            Share a recipe for the Wongnok community to follow.
          </p>
        </div>
        <RecipeForm mode="create" />
      </div>
    </RequireAuth>
  )
}
