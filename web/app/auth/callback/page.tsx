"use client"

import * as React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChefHatIcon } from "lucide-react"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { exchangeTicket } from "@/lib/api/auth"
import { setCredential } from "@/lib/auth/token-store"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const [failed, setFailed] = React.useState(false)
  const ranRef = React.useRef(false)

  React.useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    async function completeSignIn() {
      const ticket = searchParams.get("ticket")
      if (!ticket) {
        setFailed(true)
        return
      }
      try {
        const credential = await exchangeTicket(ticket)
        setCredential(credential)
        await refreshUser()
        router.replace("/")
      } catch {
        setFailed(true)
      }
    }
    completeSignIn()
  }, [searchParams, refreshUser, router])

  if (failed) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="text-lg font-semibold text-foreground">
          Sign-in link expired
        </h1>
        <p className="text-sm text-muted-foreground">
          Please try signing in again.
        </p>
        <Button nativeButton={false} render={<Link href="/" />}>
          Back to Wongnok
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <ChefHatIcon className="size-8 animate-pulse text-primary" />
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  )
}
