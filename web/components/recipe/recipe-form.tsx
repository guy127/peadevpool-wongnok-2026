"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PlusIcon, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createRecipe, deleteRecipe, updateRecipe } from "@/lib/api/recipes"
import { DIFFICULTIES, DURATIONS } from "@/lib/constants"
import type { Recipe } from "@/lib/api/types"

type RecipeFormProps = {
  mode: "create" | "edit"
  recipe?: Recipe
}

function DynamicListField({
  label,
  items,
  onChange,
  placeholder,
  numbered = false,
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
  numbered?: boolean
}) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)))
  }
  function removeItem(index: number) {
    onChange(items.length === 1 ? [""] : items.filter((_, i) => i !== index))
  }
  function addItem() {
    onChange([...items, ""])
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {numbered && (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>
            )}
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(event) => updateItem(index, event.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
              onClick={() => removeItem(index)}
            >
              <Trash2Icon />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={addItem}
      >
        <PlusIcon data-icon="inline-start" />
        Add {label.toLowerCase().replace(/s$/, "")}
      </Button>
    </div>
  )
}

export function RecipeForm({ mode, recipe }: RecipeFormProps) {
  const router = useRouter()

  const [name, setName] = React.useState(recipe?.name ?? "")
  const [description, setDescription] = React.useState(recipe?.description ?? "")
  const [imageUrl, setImageUrl] = React.useState(recipe?.imageUrl ?? "")
  const [difficultyId, setDifficultyId] = React.useState(
    recipe?.difficulty.id ?? ""
  )
  const [durationId, setDurationId] = React.useState(recipe?.duration.id ?? "")
  const [ingredients, setIngredients] = React.useState<string[]>(
    recipe?.ingredients.length
      ? recipe.ingredients.map((i) => i.description)
      : [""]
  )
  const [instructions, setInstructions] = React.useState<string[]>(
    recipe?.instructions.length
      ? recipe.instructions.map((i) => i.description)
      : [""]
  )
  const [imagePreviewOk, setImagePreviewOk] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const isValid = name.trim() && description.trim() && difficultyId && durationId

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValid || submitting) return

    setSubmitting(true)
    setFormError(null)

    const input = {
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      difficultyId,
      durationId,
      ingredients: ingredients
        .map((i) => i.trim())
        .filter(Boolean)
        .map((description) => ({ description })),
      instructions: instructions
        .map((i) => i.trim())
        .filter(Boolean)
        .map((description) => ({ description })),
    }

    try {
      if (mode === "create") {
        const { id } = await createRecipe(input)
        toast.success("Recipe published")
        router.push(`/recipes/${id}`)
      } else if (recipe) {
        await updateRecipe(recipe.id, input)
        toast.success("Changes saved")
        router.push(`/recipes/${recipe.id}`)
      }
    } catch {
      setFormError(
        mode === "create"
          ? "Couldn't publish this recipe. Please check the form and try again."
          : "Couldn't save your changes. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!recipe) return
    setDeleting(true)
    try {
      await deleteRecipe(recipe.id)
      toast.success("Recipe deleted")
      router.push("/recipes/mine")
    } catch {
      toast.error("Couldn't delete this recipe. Please try again.")
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {formError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-foreground">Basic info</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="recipe-name">Menu name</Label>
          <Input
            id="recipe-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Tom yum soup"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="recipe-description">Description</Label>
          <Textarea
            id="recipe-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="A short description of this recipe"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="recipe-image">Image URL (optional)</Label>
          <Input
            id="recipe-image"
            value={imageUrl}
            onChange={(event) => {
              setImageUrl(event.target.value)
              setImagePreviewOk(true)
            }}
            placeholder="https://..."
          />
          {imageUrl.trim() && imagePreviewOk && (
            // eslint-disable-next-line @next/next/no-img-element -- live preview of an arbitrary URL
            <img
              src={imageUrl.trim()}
              alt="Preview"
              className="mt-1 h-40 w-full rounded-lg object-cover"
              onError={() => setImagePreviewOk(false)}
            />
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Difficulty</Label>
            <Select value={difficultyId} onValueChange={(v) => setDifficultyId(String(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Time to make</Label>
            <Select value={durationId} onValueChange={(v) => setDurationId(String(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section>
        <DynamicListField
          label="Ingredients"
          items={ingredients}
          onChange={setIngredients}
          placeholder="e.g. 2 cups stock"
        />
      </section>

      <section>
        <DynamicListField
          label="Instructions"
          items={instructions}
          onChange={setInstructions}
          placeholder="e.g. Bring the stock to a simmer."
          numbered
        />
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        {mode === "edit" && recipe ? (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" />
              }
            >
              <Trash2Icon data-icon="inline-start" />
              Delete recipe
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this recipe?</AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone. &quot;{recipe.name}&quot; will be removed from Wongnok.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  disabled={deleting}
                  onClick={handleDelete}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={!isValid || submitting} className="sm:min-w-40">
          {submitting
            ? "Saving..."
            : mode === "create"
              ? "Publish recipe"
              : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
