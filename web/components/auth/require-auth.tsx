"use client"

import * as React from "react"
import { LockIcon } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { EmptyState } from "@/components/shared/empty-state"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, signIn } = useAuth()

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-24 sm:px-6">
        <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <EmptyState
          icon={LockIcon}
          title="Sign in required"
          description="Sign in with your Wongnok account to continue."
          action={{ label: "Sign in", onClick: signIn }}
        />
      </div>
    )
  }

  return <>{children}</>
}
