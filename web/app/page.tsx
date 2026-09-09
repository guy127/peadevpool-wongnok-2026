"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ChefHatIcon, CompassIcon, ListChecksIcon, ShareIcon } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { RecipeCard, RecipeCardSkeleton } from "@/components/recipe/recipe-card"
import { listRecipes } from "@/lib/api/recipes"
import type { Recipe } from "@/lib/api/types"

const STEPS = [
  {
    icon: CompassIcon,
    title: "Discover",
    description: "Browse recipes shared by home cooks and food lovers.",
  },
  {
    icon: ListChecksIcon,
    title: "Follow step by step",
    description:
      "Clear ingredients and numbered instructions, easy to follow while you cook.",
  },
  {
    icon: ShareIcon,
    title: "Share your own",
    description:
      "Become a Sharer and publish your own recipes for others to follow.",
  },
]

export default function Home() {
  const { isAuthenticated, signIn } = useAuth()
  const [recipes, setRecipes] = React.useState<Recipe[] | null>(null)

  React.useEffect(() => {
    let cancelled = false
    listRecipes({ sort: "DESC", limit: 6 })
      .then((data) => {
        if (!cancelled) setRecipes(data.results)
      })
      .catch(() => {
        // Featured recipes are non-critical on the landing page (and require
        // sign-in on this API) — fail quietly rather than showing an error.
        if (!cancelled) setRecipes([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-linear-to-b from-primary/5 to-transparent">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ChefHatIcon className="size-3.5" />
              Wongnok
            </span>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Share your recipes. Follow theirs, step by step.
            </h1>
            <p className="max-w-lg text-base text-muted-foreground">
              Wongnok is a place to publish the recipes you love and discover
              new ones — with clear ingredients and instructions you can
              follow along as you cook.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" nativeButton={false} render={<Link href="/recipes" />}>
                Browse recipes
              </Button>
              {!isAuthenticated && (
                <Button size="lg" variant="outline" onClick={signIn}>
                  Become a Sharer
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {recipes === null || recipes.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Recently shared
            </h2>
            <Link
              href="/recipes"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes === null
              ? Array.from({ length: 6 }).map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))
              : recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
          </div>
        </section>
      ) : null}

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-3 sm:px-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
