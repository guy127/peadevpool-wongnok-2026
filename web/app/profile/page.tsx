"use client"

import * as React from "react"
import { toast } from "sonner"

import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/auth/require-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateMe } from "@/lib/api/users"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function ProfileForm() {
  const { user, setUser } = useAuth()

  const [bio, setBio] = React.useState(user?.bio ?? "")
  const [imageUrl, setImageUrl] = React.useState(user?.imageUrl ?? "")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  if (!user) return null
  const currentUser = user

  const dirty = bio !== (user.bio ?? "") || imageUrl !== (user.imageUrl ?? "")

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!dirty || saving) return
    setSaving(true)
    setError(null)
    try {
      const updated = await updateMe({
        bio: bio.trim() || null,
        imageUrl: imageUrl.trim() || null,
      })
      setUser(updated)
      toast.success("Profile updated")
    } catch {
      setError("Couldn't save your profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setBio(currentUser.bio ?? "")
    setImageUrl(currentUser.imageUrl ?? "")
    setError(null)
  }

  return (
    <div className="mx-auto w-full max-w-md flex-1 px-4 py-10 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarImage src={imageUrl || undefined} alt={user.name} />
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={user.name} disabled />
              <p className="text-xs text-muted-foreground">
                Managed by your account
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
              <p className="text-xs text-muted-foreground">
                Managed by your account
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-image">Image URL</Label>
              <Input
                id="profile-image"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell others a bit about yourself"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={!dirty || saving}
                onClick={reset}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!dirty || saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileForm />
    </RequireAuth>
  )
}
