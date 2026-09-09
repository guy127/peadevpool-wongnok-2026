import { apiFetch, getApiBaseUrl } from "@/lib/api/client"
import type { Credential } from "@/lib/api/types"

export function exchangeTicket(ticket: string) {
  return apiFetch<Credential>("/auth/exchange", {
    method: "POST",
    body: { ticket },
    auth: false,
  })
}

export function logout(refreshToken: string) {
  return apiFetch<void>("/auth/logout", {
    method: "POST",
    body: { refreshToken },
    auth: false,
  })
}

export function getLoginUrl() {
  return `${getApiBaseUrl()}/auth/login`
}
