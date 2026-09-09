import { getCredential, setCredential } from "@/lib/auth/token-store"
import type { ApiErrorBody, Credential } from "@/lib/api/types"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

let refreshPromise: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  const credential = getCredential()
  if (!credential?.refreshToken) return false

  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: credential.refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("refresh failed")
        const next = (await response.json()) as Credential
        setCredential(next)
        return true
      })
      .catch(() => {
        setCredential(null)
        return false
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  auth?: boolean
  retry?: boolean
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { auth = true, retry = true, body, headers, ...rest } = options
  const credential = getCredential()

  const finalHeaders: Record<string, string> = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(headers as Record<string, string> | undefined),
  }
  if (auth && credential) {
    finalHeaders.Authorization = `${credential.bearerType} ${credential.accessToken}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401 && auth && retry) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      return apiFetch<T>(path, { ...options, retry: false })
    }
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const errorBody = (await response.json()) as ApiErrorBody
      if (errorBody?.message) message = errorBody.message
    } catch {
      // response had no JSON body — keep the generic message
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function getApiBaseUrl() {
  return BASE_URL
}
