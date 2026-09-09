"use client"

import Link from "next/link"
import { ChefHatIcon, LogOutIcon, PlusIcon, UserIcon } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function Header() {
  const { user, isLoading, isAuthenticated, signIn, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <ChefHatIcon className="size-5 text-primary" />
          <span>Wongnok</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <Link href="/recipes" className="transition-colors hover:text-foreground">
            All Recipes
          </Link>
          {isAuthenticated && (
            <Link href="/recipes/mine" className="transition-colors hover:text-foreground">
              My Recipes
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="size-8 rounded-full" />
          ) : isAuthenticated && user ? (
            <>
              <Button
                size="sm"
                className="hidden sm:inline-flex"
                nativeButton={false}
                render={<Link href="/recipes/new" />}
              >
                <PlusIcon data-icon="inline-start" />
                Create recipe
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Account menu"
                      className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  }
                >
                  <Avatar>
                    <AvatarImage src={user.imageUrl ?? undefined} alt={user.name} />
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/recipes/mine" />}>
                    <ChefHatIcon />
                    My Recipes
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/profile" />}>
                    <UserIcon />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                    <LogOutIcon />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button size="sm" onClick={signIn}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
