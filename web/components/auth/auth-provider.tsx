"use client"

import * as React from "react"

import { getLoginUrl, logout as logoutRequest } from "@/lib/api/auth"
import { getMe } from "@/lib/api/users"
import {
  getCredential,
  setCredential,
  subscribeToCredential,
} from "@/lib/auth/token-store"
import type { User } from "@/lib/api/types"

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: () => void
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: User) => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadUser = React.useCallback(async () => {
    if (!getCredential()) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const me = await getMe()
      setUser(me)
    } catch {
      setCredential(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void (async () => {
      await loadUser()
    })()
    return subscribeToCredential((credential) => {
      if (!credential) setUser(null)
    })
  }, [loadUser])

  const signIn = React.useCallback(() => {
    window.location.href = getLoginUrl()
  }, [])

  const signOut = React.useCallback(async () => {
    const credential = getCredential()
    setCredential(null)
    setUser(null)
    if (credential?.refreshToken) {
      try {
        await logoutRequest(credential.refreshToken)
      } catch {
        // token is already cleared locally; a failed remote revoke isn't user-visible
      }
    }
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      signIn,
      signOut,
      refreshUser: loadUser,
      setUser,
    }),
    [user, isLoading, signIn, signOut, loadUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
