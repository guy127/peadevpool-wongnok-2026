import Link from "next/link"
import { ChefHatIcon } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <ChefHatIcon className="size-4 text-primary" />
          <span>Wongnok</span>
        </div>
        <p className="text-center">
          A place to share recipes and follow them step by step.
        </p>
        <nav className="flex items-center gap-4">
          <Link href="/recipes" className="transition-colors hover:text-foreground">
            Recipes
          </Link>
        </nav>
      </div>
    </footer>
  )
}
