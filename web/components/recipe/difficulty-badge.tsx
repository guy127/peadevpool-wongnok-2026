import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { difficultyName } from "@/lib/constants"

const DIFFICULTY_CLASS: Record<string, string> = {
  easy: "bg-success/10 text-success",
  medium: "bg-accent/20 text-accent-foreground",
  hard: "bg-destructive/10 text-destructive",
}

export function DifficultyBadge({
  difficultyId,
  className,
}: {
  difficultyId: string
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent",
        DIFFICULTY_CLASS[difficultyId] ?? "bg-muted text-muted-foreground",
        className
      )}
    >
      {difficultyName(difficultyId)}
    </Badge>
  )
}
