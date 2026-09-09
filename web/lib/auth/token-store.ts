import type { Credential } from "@/lib/api/types"

const STORAGE_KEY = "wongnok.credential"

type Listener = (credential: Credential | null) => void

const listeners = new Set<Listener>()

function readFromStorage(): Credential | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Credential) : null
  } catch {
    return null
  }
}

let current: Credential | null = readFromStorage()

export function getCredential(): Credential | null {
  return current
}

export function setCredential(credential: Credential | null) {
  current = credential
  if (typeof window !== "undefined") {
    if (credential) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(credential))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }
  listeners.forEach((listener) => listener(current))
}

export function subscribeToCredential(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
