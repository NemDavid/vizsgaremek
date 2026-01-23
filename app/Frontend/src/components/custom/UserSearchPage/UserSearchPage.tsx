import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Search } from "lucide-react"

type User = {
  id: number
  username: string
  email?: string
  avatarUrl?: string
}

export default function UserSearchPage() {
  const [value, setValue] = useState("")

  const users: User[] = [
    { id: 1, username: "user_01", email: "user01@mail.com", avatarUrl: "https://i.pravatar.cc/150?img=1" },
    { id: 2, username: "user_02", email: "user02@mail.com", avatarUrl: "https://i.pravatar.cc/150?img=2" },
    { id: 3, username: "user_03", email: "user03@mail.com", avatarUrl: "https://i.pravatar.cc/150?img=3" },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* ===== FELSŐ RÉSZ – SEARCH BAR ===== */}
      <div className="w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Felhasználó keresése..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-14 pl-12 text-base"
          />
        </div>
      </div>

      {/* ===== ALSÓ RÉSZ – TALÁLATOK ===== */}
      <div className="w-full rounded-xl bg-red-100 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id} className="cursor-pointer transition hover:shadow-md flex items-center gap-4 p-4">
              {/* Shadcn Avatar */}
              <Avatar className="h-16 w-16">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                ) : (
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>

              {/* User info */}
              <div>
                <div className="font-semibold">{user.username}</div>
                {user.email && <div className="text-sm text-muted-foreground">{user.email}</div>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
