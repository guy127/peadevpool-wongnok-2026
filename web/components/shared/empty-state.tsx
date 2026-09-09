import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { InboxIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

export function EmptyState({
  icon: Icon = InboxIcon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action &&
        (action.href ? (
          <Button className="mt-2" nativeButton={false} render={<Link href={action.href} />}>
            {action.label}
          </Button>
        ) : (
          <Button className="mt-2" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
    </div>
  )
}
