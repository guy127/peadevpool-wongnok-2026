export type ReferenceData = {
  id: string
  name: string
}

export type Rating = {
  average: number
  total: number
}

export type Recipe = {
  id: number
  name: string
  description: string
  imageUrl: string | null
  difficulty: ReferenceData
  duration: ReferenceData
  ingredients: { id: number; description: string }[]
  instructions: { id: number; description: string }[]
  creator: { id: string; name: string }
  isFavorite: boolean
  rating: Rating
  createdAt: string
  updatedAt: string
}

export type RecipeListResponse = {
  total: number
  results: Recipe[]
}

export type RecipeWriteInput = {
  name: string
  description: string
  imageUrl?: string
  difficultyId: string
  durationId: string
  ingredients: { description: string }[]
  instructions: { description: string }[]
}

export type User = {
  id: string
  name: string
  email: string
  imageUrl: string | null
  bio: string | null
}

export type Credential = {
  accessToken: string
  refreshToken: string
  bearerType: string
  expiresAt: string
}

export type ApiErrorBody = {
  message: string
  code?: string
}
