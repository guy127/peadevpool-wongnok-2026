import type { ReferenceData } from "@/lib/api/types"

// GET /difficulties and GET /durations are not implemented server-side yet
// (see api/docs/API.md — Reference data). These are the fixed values the
// API already validates difficultyId/durationId against.
export const DIFFICULTIES: ReferenceData[] = [
  { id: "easy", name: "Easy" },
  { id: "medium", name: "Medium" },
  { id: "hard", name: "Hard" },
]

export const DURATIONS: ReferenceData[] = [
  { id: "10m", name: "5 - 10 mins" },
  { id: "30m", name: "10 - 30 mins" },
  { id: "60m", name: "~1 Hour" },
  { id: "long", name: "More than 1 hour" },
]

export function difficultyName(id: string) {
  return DIFFICULTIES.find((d) => d.id === id)?.name ?? id
}

export function durationName(id: string) {
  return DURATIONS.find((d) => d.id === id)?.name ?? id
}
