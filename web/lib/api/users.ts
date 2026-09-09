import { apiFetch } from "@/lib/api/client"
import type { User } from "@/lib/api/types"

export function getMe() {
  return apiFetch<User>("/users/me")
}

export function updateMe(input: { imageUrl?: string | null; bio?: string | null }) {
  return apiFetch<User>("/users/me", {
    method: "PUT",
    body: input,
  })
}
